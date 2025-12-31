import type { FC } from 'react';

interface FooterProps {
    config?: {
        footer_phone: string;
        footer_whatsapp: string;
        footer_address: string;
        footer_hours: string;
        footer_email: string;
    } | null;
}

const Footer: FC<FooterProps> = ({ config }) => {
    const handleScrollTo = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (window.location.hash !== '#/') {
            window.location.hash = '#/';
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-white dark:bg-brand-dark border-t border-gray-100 dark:border-white/5 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
                    {/* Brand & Contact */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="flex flex-col items-start">
                            <span className="text-2xl font-black text-brand-dark dark:text-white tracking-tighter leading-none uppercase">
                                Adão <span className="text-brand-primary">Silva</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Imóveis</span>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <a href={`tel:${config?.footer_phone?.replace(/\D/g, '') || '6436713590'}`} className="flex items-center gap-4 text-slate-500 hover:text-brand-primary transition-colors group">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:bg-brand-primary/10 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span className="font-bold text-sm md:text-base">{config?.footer_phone || '64 3671-3590'}</span>
                            </a>
                            <div className="flex items-start gap-4 text-slate-500 group">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:bg-brand-primary/10 transition-colors shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="font-bold text-sm md:text-base leading-tight">
                                    {config?.footer_address ? config.footer_address.split('-').slice(0, 2).join('-') : 'R. P-20, Setor Perimetral,'}
                                    <br />
                                    {config?.footer_address ? config.footer_address.split('-').slice(2).join('-') : 'Iporá - GO'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-6 md:mb-8">Navegação</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li><a href="#/" className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Início</a></li>
                            <li><a href="#imoveis" onClick={(e) => handleScrollTo(e, 'imoveis')} className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Imóveis</a></li>
                            <li><a href="#loteamentos" onClick={(e) => handleScrollTo(e, 'loteamentos')} className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Loteamentos</a></li>
                            <li><a href="#/sobre" className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Sobre Nós</a></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-6 md:mb-8">Portal</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li><a href="#/blog" className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Blog & Insights</a></li>
                            <li><a href="#/privacidade" className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Privacidade</a></li>
                            <li><a href="#/login" className="text-sm md:text-base text-slate-500 hover:text-brand-primary font-bold transition-colors">Área do Consultor</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-6 md:mb-8">Redes Sociais</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/adaosilvaimoveisslmb/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-brand-primary hover:text-white transition-all">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="https://wa.me/556436713590" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-brand-primary hover:text-white transition-all">
                                <span className="sr-only">WhatsApp</span>
                                <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 text-center md:text-left">
                        © {new Date().getFullYear()} Adão Silva Imóveis. CRECI-J 22.477. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Built with Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
