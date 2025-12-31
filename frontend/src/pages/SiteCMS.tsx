import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

interface SiteConfig {
    hero_title: string;
    hero_subtitle: string;
    hero_image_url: string;
    footer_phone: string;
    footer_whatsapp: string;
    footer_address: string;
    footer_hours: string;
    footer_email: string;
}

export default function SiteCMS() {
    const [config, setConfig] = useState<SiteConfig>({
        hero_title: '',
        hero_subtitle: '',
        hero_image_url: '',
        footer_phone: '',
        footer_whatsapp: '',
        footer_address: '',
        footer_hours: '',
        footer_email: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        supabase.from('site_config').select('*').single()
            .then(({ data, error }) => {
                if (data) setConfig(data);
                if (error) console.error('Error fetching config:', error);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // We assume singleton config with ID 1
            const { error } = await supabase
                .from('site_config')
                .update(config)
                .eq('id', 1);

            if (error) throw error;
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Erro ao salvar configurações.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setConfig({ ...config, hero_image_url: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <AdminLayout activePath="#/admin/cms">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-white font-black animate-pulse uppercase tracking-[0.3em]">Carregando Configurações...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePath="#/admin/cms">
            <div className="p-4 md:p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Controle da Vitrine</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Gerencie Banners, Textos e Contatos</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                    {/* Editor Form */}
                    <div className="space-y-6 md:space-y-8">
                        <section className="bg-slate-900/40 border border-slate-800/50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] backdrop-blur-sm">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Banner Principal (Hero)
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Título de Impacto</label>
                                    <input
                                        type="text"
                                        value={config.hero_title}
                                        onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 mt-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Subtítulo / Frase</label>
                                    <textarea
                                        value={config.hero_subtitle}
                                        onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 mt-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors min-h-[100px] resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Imagem de Fundo</label>
                                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <label className="w-full sm:w-auto cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors text-center">
                                            Selecionar Imagem
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {config.hero_image_url && <span className="text-[10px] text-emerald-400 font-bold uppercase">Imagem Carregada</span>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-900/40 border border-slate-800/50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] backdrop-blur-sm">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                Rodapé & Contatos
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Telefone</label>
                                    <input
                                        type="text"
                                        value={config.footer_phone}
                                        onChange={(e) => setConfig({ ...config, footer_phone: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={config.footer_whatsapp}
                                        onChange={(e) => setConfig({ ...config, footer_whatsapp: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Endereço Completo</label>
                                    <input
                                        type="text"
                                        value={config.footer_address}
                                        onChange={(e) => setConfig({ ...config, footer_address: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Funcionamento</label>
                                    <input
                                        type="text"
                                        value={config.footer_hours}
                                        onChange={(e) => setConfig({ ...config, footer_hours: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={config.footer_email}
                                        onChange={(e) => setConfig({ ...config, footer_email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Live Preview (Conditional hidden/visible based on screen size) */}
                    <div className="lg:block">
                        <div className="sticky top-8 space-y-6">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest ml-4 mb-2">Live Preview (Mobile)</h3>

                            {/* Hero Preview */}
                            <div className="relative w-full max-w-[280px] md:max-w-[320px] mx-auto aspect-[9/16] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0">
                                    {config.hero_image_url ? (
                                        <img src={config.hero_image_url} className="w-full h-full object-cover opacity-50" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
                                    <h2 className="text-2xl font-black text-white tracking-tighter leading-none">{config.hero_title || 'Título Aqui'}</h2>
                                    <p className="text-[10px] text-slate-300 font-medium leading-relaxed opacity-80">{config.hero_subtitle || 'Sua frase de efeito aqui.'}</p>
                                    <div className="w-20 h-1 bg-blue-500 rounded-full" />
                                </div>
                            </div>

                            {/* Footer Preview */}
                            <div className="hidden md:block bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-[320px] mx-auto">
                                <h4 className="text-[10px] font-black text-white tracking-widest uppercase">Preview Rodapé</h4>
                                <div className="space-y-2 opacity-60">
                                    <p className="text-[10px] text-slate-400">📍 {config.footer_address || 'Endereço fictício'}</p>
                                    <p className="text-[10px] text-slate-400">📞 {config.footer_phone || '(11) 0000-0000'}</p>
                                    <p className="text-[10px] text-slate-400">⏰ {config.footer_hours || 'Seg - Sex'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
