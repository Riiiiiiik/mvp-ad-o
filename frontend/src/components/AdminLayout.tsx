import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface AdminLayoutProps {
    children: ReactNode;
    activePath: string;
}

export default function AdminLayout({ children, activePath }: AdminLayoutProps) {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.hash = '#/login';
                return;
            }

            setUserEmail(session.user.email || 'Usuário');

            // Fetch role from public table
            const { data: userProfile } = await supabase
                .from('usuarios')
                .select('role')
                .eq('id', session.user.id)
                .single();

            setUserRole(userProfile?.role || 'vendedor');
            setLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                window.location.hash = '#/login';
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.hash = '#/login';
    };

    const isAdmin = userRole === 'admin';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                Carregando Acesso...
            </div>
        );
    }

    const menuItems = [
        {
            name: 'Dashboard', path: '#/admin', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Imóveis', path: '#/admin/properties', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: 'Insights', path: '#/admin/analytics', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        // Admin Only Links
        ...(isAdmin ? [
            {
                name: 'Equipe', path: '#/admin/users', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )
            },
            {
                name: 'Segurança', path: '#/admin/audit', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                )
            },
            {
                name: 'Site', path: '#/admin/cms', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                )
            }
        ] : []),
        {
            name: 'Sair', onClick: handleLogout, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ), danger: true
        },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col">
                <div className="p-6 border-b border-slate-900">
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase text-center">Back Office</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-1">Real Estate CRM</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        item.path ? (
                            <a
                                key={item.name}
                                href={item.path}
                                target={(item as any).external ? "_blank" : undefined}
                                rel={(item as any).external ? "noopener noreferrer" : undefined}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activePath === item.path
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </a>
                        ) : (
                            <button
                                key={item.name}
                                onClick={item.onClick}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                            >
                                {item.icon}
                                {item.name}
                            </button>
                        )
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-900">
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Logado como</p>
                        <p className="text-xs font-bold text-white truncate">{userEmail}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
