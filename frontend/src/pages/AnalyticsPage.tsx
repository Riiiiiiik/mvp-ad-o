import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface ChartData {
    date: string;
    views: number;
}

interface TopProperty {
    titulo: string;
    views: number;
}

interface AnalyticsStats {
    views_chart: ChartData[];
    top_properties: TopProperty[];
    conversion_rate: number;
    total_leads: number;
    total_views: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Fetching analytics data...');
        fetch('http://127.0.0.1:8000/api/analytics/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Analytics data received:', data);
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching analytics:', err);
                setLoading(false);
            });
    }, []);

    // Secure calculation of maxViews
    const maxViews = (stats && stats.views_chart && Array.isArray(stats.views_chart))
        ? Math.max(...stats.views_chart.map(d => d.views || 0), 1)
        : 1;

    return (
        <AdminLayout activePath="#/admin/analytics">
            <div className="p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Insights do Portfólio</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Análise de Performance & Engajamento</p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : stats ? (
                    <>
                        {/* Top KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] backdrop-blur-sm">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Taxa de Conversão</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">{stats.conversion_rate}%</span>
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Leads/Visitas</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] backdrop-blur-sm">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Total de Audiência</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">{stats.total_views}</span>
                                    <span className="text-[10px] text-blue-400 font-bold uppercase">Visualizações</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] backdrop-blur-sm">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Base de Leads</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">{stats.total_leads}</span>
                                    <span className="text-[10px] text-purple-400 font-bold uppercase">Contatos</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Views Chart */}
                            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem]">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Tráfego nos Últimos 7 Dias</h3>
                                <div className="relative h-64 flex items-end gap-4 px-2">
                                    {stats.views_chart.map((day, idx) => {
                                        const height = (day.views / maxViews) * 100;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                                                <div className="relative w-full flex items-end justify-center h-full">
                                                    <div
                                                        style={{ height: `${height}%` }}
                                                        className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl transition-all group-hover:from-blue-500 group-hover:to-blue-300 relative group"
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                                            {day.views} vis.
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">{day.date}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Top Properties */}
                            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem]">
                                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Top Performance</h3>
                                <div className="space-y-6">
                                    {stats.top_properties.map((prop, idx) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-black text-slate-700 w-4">#{(idx + 1)}</span>
                                                <p className="text-[11px] text-slate-300 font-bold uppercase truncate max-w-[150px] group-hover:text-blue-400 transition-colors">
                                                    {prop.titulo}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-white">{prop.views}</p>
                                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Visualizações</p>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.top_properties.length === 0 && (
                                        <p className="text-center text-slate-600 text-[10px] font-bold uppercase py-10">Nenhum dado ainda</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-sm font-bold text-center">
                        Erro ao carregar dados de analítica.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
