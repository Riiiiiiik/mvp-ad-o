import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

interface Lead {
    id: number;
    nome: string;
    whatsapp: string;
    email?: string;
    origem?: string;
    status: string;
    anotacoes?: string;
    usuario_id?: string | null; // UUID
    created_at: string;
}

interface User {
    id: string; // UUID in Supabase
    email: string;
    role: string;
}

interface Stats {
    leads_today: number;
    leads_week: number;
    active_properties: number;
    total_views: number;
}

const STATUS_COLUMNS = [
    { id: 'NOVO', label: 'Novos', color: 'border-cyan-500/50 text-cyan-400' },
    { id: 'CONTATO', label: 'Em Contato', color: 'border-amber-500/50 text-amber-400' },
    { id: 'AGENDOU VISITA', label: 'Visita Agendada', color: 'border-purple-500/50 text-purple-400' },
    { id: 'PROPOSTA', label: 'Proposta', color: 'border-blue-500/50 text-blue-400' },
    { id: 'GANHO', label: 'Ganho', color: 'border-emerald-500/50 text-emerald-400' },
    { id: 'PERDIDO', label: 'Perdido', color: 'border-red-500/50 text-red-400' },
];

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.hash = '#/login';
            return;
        }

        try {
            // Fetch Leads
            const { data: leadsData } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            setLeads(leadsData || []);

            // Stats Calculations
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);

            const { count: leadsToday } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            const { count: leadsWeek } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', lastWeek.toISOString());

            const { count: activeProps } = await supabase
                .from('properties')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'ATIVO');

            // Check Admin Role
            const { data: userProfile } = await supabase
                .from('usuarios')
                .select('role')
                .eq('id', session.user.id)
                .single();

            const role = userProfile?.role || 'vendedor';
            setIsAdmin(role === 'admin');

            if (role === 'admin') {
                const { data: usersData } = await supabase
                    .from('usuarios')
                    .select('id, email, role');
                setUsers(usersData || []);
            }

            setStats({
                leads_today: leadsToday || 0,
                leads_week: leadsWeek || 0,
                active_properties: activeProps || 0,
                total_views: 0 // Placeholder for now
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Real-time subscription for leads
        const channel = supabase
            .channel('leads_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            // Stats will auto-update via subscription or simple re-fetch if needed
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const assignLead = async (id: number, userId: string | null) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ usuario_id: userId })
                .eq('id', id);

            if (error) throw error;

            setLeads(leads.map(lead => lead.id === id ? { ...lead, usuario_id: userId } : lead));
        } catch (error) {
            console.error('Error assigning lead:', error);
        }
    };

    const openWhatsApp = (number: string, name: string) => {
        const cleanNumber = number.replace(/\D/g, '');
        const message = encodeURIComponent(`Olá ${name}, vi seu interesse no imóvel e gostaria de conversar!`);
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    };

    const onDragStart = (id: number) => setDraggingId(id);
    const onDragOver = (e: React.DragEvent) => e.preventDefault();
    const onDrop = (status: string) => {
        if (draggingId !== null) {
            updateStatus(draggingId, status);
            setDraggingId(null);
        }
    };

    const groupedLeads = STATUS_COLUMNS.reduce((acc, col) => {
        acc[col.id] = leads.filter(l => l.status === col.id);
        return acc;
    }, {} as Record<string, Lead[]>);

    return (
        <AdminLayout activePath="#/admin">
            <div className="p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Visão Geral</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Como está o negócio hoje?</p>
                    </div>

                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all text-white text-xs font-bold"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Atualizar Dados
                    </button>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Leads Hoje', value: stats?.leads_today ?? '...', iconColor: 'text-blue-500', bgColor: 'bg-blue-500/10' },
                        { label: 'Leads Semana', value: stats?.leads_week ?? '...', iconColor: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                        { label: 'Imóveis Ativos', value: stats?.active_properties ?? '...', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
                        { label: 'Visualizações', value: stats?.total_views ?? '...', iconColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl hover:border-slate-700 transition-all">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black text-white">{kpi.value}</h3>
                                <div className={`${kpi.bgColor} ${kpi.iconColor} p-2 rounded-xl`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                                        {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                                        {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                                        {i === 3 && <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Funnel Section Wrapper */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Funil de Vendas</h2>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Real-time Sync</span>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {STATUS_COLUMNS.map((column) => (
                            <div
                                key={column.id}
                                onDragOver={onDragOver}
                                onDrop={() => onDrop(column.id)}
                                className="w-80 flex-shrink-0 flex flex-col bg-slate-900/40 rounded-3xl border border-slate-800/50 p-4 min-h-[500px] transition-colors hover:bg-slate-900/60"
                            >
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <h2 className={`font-black text-[10px] uppercase tracking-[0.2em] ${column.color.split(' ')[1]}`}>
                                        {column.label}
                                    </h2>
                                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {groupedLeads[column.id]?.length || 0}
                                    </span>
                                </div>

                                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    {loading ? (
                                        <div className="h-24 animate-pulse bg-slate-800/20 rounded-2xl"></div>
                                    ) : groupedLeads[column.id]?.length === 0 ? (
                                        <div className="border-2 border-dashed border-slate-800/50 rounded-2xl h-32 flex items-center justify-center opacity-50">
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center px-4">Sem leads aqui</p>
                                        </div>
                                    ) : (
                                        groupedLeads[column.id].map((lead) => (
                                            <div
                                                key={lead.id}
                                                draggable
                                                onDragStart={() => onDragStart(lead.id)}
                                                className={`bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all group shadow-xl ${draggingId === lead.id ? 'opacity-50 border-blue-500 scale-95' : 'hover:border-slate-600 hover:-translate-y-1'}`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-sm text-white leading-tight uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                                                        {lead.nome}
                                                    </h3>
                                                    {isAdmin && (
                                                        <select
                                                            value={lead.usuario_id || ''}
                                                            onChange={(e) => assignLead(lead.id, e.target.value || null)}
                                                            className="bg-slate-800 text-[9px] text-slate-400 border border-slate-700 rounded px-1 py-0.5 focus:outline-none"
                                                        >
                                                            <option value="">Não atribuído</option>
                                                            {users.map(u => (
                                                                <option key={u.id} value={u.id}>
                                                                    {u.email.split('@')[0]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                <div className="text-[9px] text-slate-500 font-bold mb-4 uppercase tracking-widest flex flex-col gap-1.5">
                                                    <span className="flex items-center gap-2">
                                                        <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                        {lead.origem || 'Direto'}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => openWhatsApp(lead.whatsapp, lead.nome)}
                                                    className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                                                >
                                                    Chamar no Zap
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
