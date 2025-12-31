import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

interface AuditLog {
    id: number;
    user_email: string;
    acao: string;
    recurso_tipo: string;
    recurso_id: number | null;
    detalhes: string;
    timestamp: string;
}

export default function SecurityLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatTimestamp = (ts: string) => {
        return new Date(ts).toLocaleString('pt-BR');
    };

    const getActionColor = (acao: string) => {
        if (acao.includes('DELETE')) return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (acao.includes('UPDATE_PRICE')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        if (acao.includes('CREATE')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    return (
        <AdminLayout activePath="#/admin/audit">
            <div className="p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Logs de Segurança</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Auditagem completa de ações críticas no sistema</p>
                </header>

                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-900/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data / Hora</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ação</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Detalhes da Alteração</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-400">{formatTimestamp(log.timestamp)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white">{log.user_email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getActionColor(log.acao)}`}>
                                            {log.acao}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-medium text-slate-300 italic">"{log.detalhes}"</p>
                                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-1">Ref: {log.recurso_tipo} #{log.recurso_id}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && !loading && (
                        <div className="p-20 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Ainda não há registros de auditoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
