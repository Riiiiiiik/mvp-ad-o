import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || isMenuOpen ? 'bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <a href="#/" className="block group">
                        <img src="/adao-logo.svg" alt="Adão Silva Imóveis" className="h-10 md:h-12 w-auto group-hover:opacity-90 transition-opacity" />
                    </a>
                    <div className={`hidden lg:flex items-center gap-8 text-sm font-black uppercase tracking-widest ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                        <a href="#/sobre" className="hover:text-brand-primary transition-colors">Sobre</a>
                        <a href="#/blog" className="hover:text-brand-primary transition-colors">Blog</a>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="#/login" className={`text-xs font-black flex items-center gap-2 px-6 py-2.5 rounded-full transition-all shadow-lg uppercase tracking-widest ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                            Entrar
                        </a>
                        <button
                            onClick={() => document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${scrolled ? 'bg-brand-primary text-brand-dark hover:bg-brand-dark hover:text-white' : 'bg-brand-primary text-brand-dark hover:bg-white'}`}
                        >
                            Vender Imóvel
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 rounded-xl transition-colors lg:hidden ${scrolled || isMenuOpen ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5' : 'text-white bg-white/10'}`}
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`lg:hidden fixed inset-0 top-full bg-white dark:bg-brand-dark z-40 transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'} border-t border-gray-100 dark:border-white/5 h-screen overflow-y-auto`}>
                <div className="p-8 space-y-8">
                    <div className="flex flex-col gap-6 text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                        <a href="#/" onClick={() => setIsMenuOpen(false)}>Início</a>
                        <a href="#/sobre" onClick={() => setIsMenuOpen(false)}>Sobre a Adão Silva</a>
                        <a href="#/blog" onClick={() => setIsMenuOpen(false)}>Blog e Insights</a>
                        <a href="#imoveis" onClick={() => { setIsMenuOpen(false); document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' }); }}>Imóveis</a>
                        <a href="#loteamentos" onClick={() => { setIsMenuOpen(false); document.getElementById('loteamentos')?.scrollIntoView({ behavior: 'smooth' }); }}>Loteamentos</a>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                            <span className="text-xs font-black uppercase text-slate-400">Modo de Visualização</span>
                            <ThemeToggle />
                        </div>
                        <a href="#/login" className="flex items-center justify-center w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                            Área do Consultor
                        </a>
                        <button
                            onClick={() => { setIsMenuOpen(false); document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="w-full bg-brand-primary text-brand-dark py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20"
                        >
                            Vender meu Imóvel
                        </button>
                    </div>

                    <div className="pt-8 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Central de Atendimento</p>
                        <a href="tel:6436713590" className="text-xl font-black text-brand-dark dark:text-white tracking-tighter">64 3671-3590</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
