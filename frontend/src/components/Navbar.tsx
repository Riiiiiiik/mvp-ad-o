import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav className={`fixed w-full z-50 transition-colors duration-500 ${scrolled ? 'bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <a href="#/" className="block group">
                        <img src="/adao-logo.svg" alt="Adão Silva Imóveis" className="h-12 w-auto group-hover:opacity-90 transition-opacity" />
                    </a>
                    <div className={`hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-widest ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                        <a
                            href="#/sobre"
                            className="hover:text-brand-primary transition-colors"
                        >
                            Sobre
                        </a>
                        <a
                            href="#/blog"
                            className="hover:text-brand-primary transition-colors"
                        >
                            Blog
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <a href="#/login" className={`text-sm font-black flex items-center gap-2 px-6 py-2.5 rounded-full transition-all shadow-lg uppercase tracking-widest ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Entrar
                    </a>
                    <button
                        onClick={() => document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-black/10 ${scrolled ? 'bg-brand-dark dark:bg-brand-primary text-white hover:bg-slate-900' : 'bg-brand-primary text-brand-dark hover:bg-white hover:text-brand-dark'}`}
                    >
                        + Vender Imóvel
                    </button>
                </div>
            </div>
        </nav>
    );
}
