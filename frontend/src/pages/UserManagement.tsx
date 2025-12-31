import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface User {
    id: number;
    email: string;
    role: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New User Form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('vendedor');
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('crm_token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('crm_token')}`
                },
                body: JSON.stringify({ email, password, role })
            });

            if (response.ok) {
                alert('Usuário criado com sucesso!');
                setShowModal(false);
                setEmail('');
                setPassword('');
                fetchUsers();
            } else {
                const data = await response.json();
                alert(data.detail || 'Erro ao criar usuário');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout activePath="#/admin/users">
            <div className="p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Gestão da Equipe</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Cadastre corretores e gerencie acessos</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                    >
                        Novo Integrante
                    </button>
                </header>

                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-900/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center w-20">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail de Acesso</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Papel / Cargo</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500 text-center">{user.id}</td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white">{user.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Resetar Senha</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && !loading && (
                        <div className="p-20 text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum corretor cadastrado além de você.</p>
                        </div>
                    )}
                </div>

                {/* Modal Novo Usuário */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Cadastrar Novo Corretor</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 mt-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="nome@adaosilva.com.br"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Senha Temporária</label>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 mt-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Nível de Acesso</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 mt-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="vendedor">Corretor (Acesso restrito)</option>
                                        <option value="admin">Administrador (Controle total)</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-slate-800 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                    >
                                        {saving ? 'Criando...' : 'Criar Conta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
