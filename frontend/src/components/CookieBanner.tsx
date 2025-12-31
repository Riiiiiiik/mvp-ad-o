import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('lgpd_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('lgpd_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/5 p-4 md:px-8 md:py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-4 justify-between">
                <p className="text-slate-300 text-[11px] font-medium leading-tight text-center md:text-left">
                    Usamos cookies para otimizar sua experiência. Ao continuar, você concorda com nossa <a href="#/privacidade" className="text-blue-400 hover:underline font-bold">Política de Privacidade</a>.
                </p>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
                    >
                        Aceitar
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
