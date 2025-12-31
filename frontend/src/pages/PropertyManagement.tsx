import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';
import type { PropertyImage } from '../types/property';
import { useProperties } from '../hooks/useProperties';


export default function PropertyManagement() {
    const { properties, loading, fetchProperties } = useProperties();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [isSearchingCep, setIsSearchingCep] = useState(false);
    const [cep, setCep] = useState('');
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const [newProp, setNewProp] = useState({
        titulo: '',
        descricao: '',
        preco: '',
        condominio: '',
        iptu: '',
        localizacao: '',
        tipo: 'Casa',
        quartos: 0,
        banheiros: 0,
        vagas: 0,
        area: '',
        status: 'ATIVO',
        video_url: '',
        main_image_url: '',
        thumb_image_url: '',
        is_destaque: 0,
        cep: '',
        images: [] as PropertyImage[]
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProperties({ searchTerm });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchProperties]);

    const convertToWebP = (file: File, maxWidth: number, quality: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/webp', quality));
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsProcessingImage(true);
        try {
            const processedImages: PropertyImage[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Generate Desktop version (1200px)
                const desktopWebP = await convertToWebP(file, 1200, 0.8);
                // Generate Mobile version (600px)
                const mobileWebP = await convertToWebP(file, 600, 0.7);

                processedImages.push({
                    image_url: desktopWebP,
                    thumb_url: mobileWebP,
                    ordem: newProp.images.length + i
                });
            }

            setNewProp(prev => {
                const updatedImages = [...prev.images, ...processedImages];
                // Se não houver foto principal, define a primeira como principal
                const mainImg = prev.main_image_url || updatedImages[0].image_url;
                const thumbImg = prev.thumb_image_url || updatedImages[0].thumb_url || '';

                return {
                    ...prev,
                    images: updatedImages,
                    main_image_url: mainImg,
                    thumb_image_url: thumbImg
                };
            });
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Erro ao processar imagem. Tente outro formato.');
        } finally {
            setIsProcessingImage(false);
        }
    };

    const removeImage = (index: number) => {
        setNewProp(prev => {
            const updatedImages = prev.images.filter((_, i) => i !== index);
            // Se removeu a foto que era a principal, atualiza a principal com a próxima disponível ou limpa
            let mainImg = prev.main_image_url;
            let thumbImg = prev.thumb_image_url;

            if (prev.images[index].image_url === prev.main_image_url) {
                mainImg = updatedImages.length > 0 ? updatedImages[0].image_url : '';
                thumbImg = updatedImages.length > 0 ? (updatedImages[0].thumb_url || '') : '';
            }

            return {
                ...prev,
                images: updatedImages,
                main_image_url: mainImg,
                thumb_image_url: thumbImg
            };
        });
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const updatedImages = [...newProp.images];
        const [movedItem] = updatedImages.splice(draggedItemIndex, 1);
        updatedImages.splice(index, 0, movedItem);

        // Update ordem and state
        const reorderedImages = updatedImages.map((img, idx) => ({ ...img, ordem: idx }));

        setNewProp(prev => ({ ...prev, images: reorderedImages }));
        setDraggedItemIndex(null);
    };

    const handleAddProperty = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare Property Data
        const { images, cep, ...rest } = newProp;

        const propertyToInsert = {
            ...rest,
            quartos: parseInt(newProp.quartos as any) || 0,
            banheiros: parseInt(newProp.banheiros as any) || 0,
            vagas: parseInt(newProp.vagas as any) || 0,
        };

        try {
            const { data: prop, error: propError } = await supabase
                .from('properties')
                .insert([propertyToInsert])
                .select()
                .single();

            if (propError) throw propError;

            if (images.length > 0 && prop) {
                const imagesToInsert = images.map(img => ({
                    property_id: prop.id,
                    image_url: img.image_url,
                    thumb_url: img.thumb_url,
                    ordem: img.ordem
                }));

                const { error: imgError } = await supabase
                    .from('property_images')
                    .insert(imagesToInsert);

                if (imgError) throw imgError;
            }

            setShowAddModal(false);
            setNewProp({
                titulo: '', descricao: '', preco: '', condominio: '', iptu: '',
                localizacao: '', tipo: 'Casa', quartos: '' as any, banheiros: '' as any, vagas: '' as any,
                area: '', status: 'ATIVO', video_url: '', main_image_url: '',
                thumb_image_url: '', is_destaque: 0, cep: '', images: []
            });
            setCep('');
            fetchProperties();

        } catch (error) {
            console.error('Error adding property:', error);
        }
    };

    const handleCepBlur = async (cepInput: string) => {
        const cleanCep = cepInput.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setIsSearchingCep(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
            if (response.ok) {
                const data = await response.json();
                const neighborhood = data.neighborhood || '';
                const cityState = `${data.city} - ${data.state}`;
                const fullLocation = neighborhood ? `${neighborhood}, ${cityState}` : cityState;

                setNewProp(prev => ({
                    ...prev,
                    localizacao: fullLocation,
                    cep: cleanCep
                }));
            }
        } catch (error) {
            console.error('Error fetching CEP:', error);
        } finally {
            setIsSearchingCep(false);
        }
    };

    const formatCurrency = (value: string) => {
        // Remove tudo que não é dígito
        const cleanValue = value.replace(/\D/g, '');
        if (!cleanValue) return '';

        // Converte para centavos e então para moeda brasileira
        const amount = (parseInt(cleanValue) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        return amount;
    };

    return (
        <AdminLayout activePath="#/admin/properties">
            <div className="p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Inventário</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de Portfólio & Mídia</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                placeholder="Buscar por título ou bairro..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-10 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            />
                            <svg className="w-4 h-4 text-slate-600 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl transition-all text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 whitespace-nowrap"
                        >
                            Novo Imóvel
                        </button>
                    </div>
                </header>

                {/* Properties List */}
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                <th className="px-6 py-5">Imóvel</th>
                                <th className="px-6 py-5">Info</th>
                                <th className="px-6 py-5">Valores</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-center">Destaque</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/20">
                            {loading && properties.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Indexando catálogo...</td></tr>
                            ) : properties.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px]">Nenhum imóvel encontrado</td></tr>
                            ) : properties.map((prop) => (
                                <tr key={prop.id} className="hover:bg-slate-800/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {prop.main_image_url ? (
                                                <img src={prop.main_image_url} alt={prop.titulo} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{prop.titulo}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{prop.localizacao}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[9px] bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded-lg font-bold border border-slate-800/50">
                                                {prop.tipo}
                                            </span>
                                            <span className="text-[9px] bg-blue-500/5 text-blue-400/70 px-2 py-0.5 rounded-lg font-bold border border-blue-500/10">
                                                {prop.area || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 mt-1.5 text-slate-500 text-[9px] font-bold">
                                            <span>{prop.quartos}Q</span>
                                            <span>{prop.banheiros}B</span>
                                            <span>{prop.vagas}V</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-white text-xs whitespace-nowrap">{prop.preco || 'Sob consulta'}</p>
                                        <div className="flex gap-2 text-[9px] text-slate-600 font-bold mt-0.5">
                                            <span>C: {prop.condominio || '-'}</span>
                                            <span>I: {prop.iptu || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-widest border ${prop.status === 'ATIVO' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                                            prop.status === 'VENDIDO' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-slate-700 text-slate-500'
                                            }`}>
                                            {prop.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {prop.is_destaque === 1 && (
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-600 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-xl">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
                        <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[32px] shadow-2xl my-8 animate-in fade-in zoom-in duration-300">
                            <div className="p-8 md:p-10">
                                <form onSubmit={handleAddProperty} className="space-y-8">
                                    {/* Seção 1: Mídia */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            <h4 className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Álbum de Fotos & Destaque</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Botão de Upload Múltiplo */}
                                            <label className="col-span-1 border-2 border-dashed border-slate-800 rounded-[24px] p-6 hover:border-blue-500/50 transition-all cursor-pointer bg-slate-950/50 group relative flex flex-col items-center justify-center min-h-[140px]">
                                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                {isProcessingImage ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                                                        <p className="text-[8px] text-blue-400 font-bold uppercase">Processando...</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center">
                                                        <svg className="w-8 h-8 text-slate-700 group-hover:text-blue-500/50 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Adicionar Fotos</p>
                                                    </div>
                                                )}
                                            </label>

                                            {/* Galeria de Miniaturas */}
                                            <div className="col-span-3 grid grid-cols-4 md:grid-cols-6 gap-3 min-h-[140px] bg-slate-950/20 p-4 rounded-3xl border border-slate-800/50">
                                                {newProp.images.map((img, index) => (
                                                    <div
                                                        key={index}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, index)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, index)}
                                                        className={`relative group aspect-square cursor-move transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50 scale-95' : 'opacity-100'}`}
                                                    >
                                                        <img
                                                            src={img.thumb_url || img.image_url}
                                                            className={`w-full h-full rounded-xl object-cover border-2 transition-all ${newProp.main_image_url === img.image_url ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-800 group-hover:border-slate-700'}`}
                                                            alt={`Foto ${index}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                        {newProp.main_image_url === img.image_url && (
                                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-[6px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Capa</span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProp({ ...newProp, main_image_url: img.image_url, thumb_image_url: img.thumb_url || '' })}
                                                            className="absolute inset-0 z-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity"
                                                        >
                                                            <span className="text-[7px] text-white font-black uppercase tracking-widest">Definir Capa</span>
                                                        </button>
                                                    </div>
                                                ))}
                                                {newProp.images.length === 0 && (
                                                    <div className="col-span-full flex items-center justify-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                                                        Nenhuma foto selecionada
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-1 space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Destaque Home</label>
                                                    <label className="flex items-center cursor-pointer gap-3 bg-slate-950/50 border border-slate-800 p-3 rounded-2xl hover:border-slate-700 transition-all">
                                                        <input
                                                            type="checkbox"
                                                            checked={newProp.is_destaque === 1}
                                                            onChange={(e) => setNewProp({ ...newProp, is_destaque: e.target.checked ? 1 : 0 })}
                                                            className="w-4 h-4 rounded-md bg-slate-900 border-slate-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
                                                        />
                                                        <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Ativar</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 2: Dados Básicos */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            <h4 className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Informações Gerais</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">CEP (Busca Automática)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={cep}
                                                        onChange={e => setCep(e.target.value)}
                                                        onBlur={e => handleCepBlur(e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
                                                        placeholder="00000-000"
                                                    />
                                                    {isSearchingCep && (
                                                        <div className="absolute right-3 top-3.5">
                                                            <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1 md:col-span-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Título do Anúncio</label>
                                                <input required type="text" value={newProp.titulo} onChange={e => setNewProp({ ...newProp, titulo: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="Apartamento de Luxo..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Bairro / Localidade</label>
                                                <input required type="text" value={newProp.localizacao} onChange={e => setNewProp({ ...newProp, localizacao: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="Ex: Leblon, Rio de Janeiro" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Valor Venda</label>
                                                <input
                                                    type="text"
                                                    value={newProp.preco}
                                                    onChange={e => setNewProp({ ...newProp, preco: formatCurrency(e.target.value) })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold"
                                                    placeholder="R$ 0,00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Condomínio</label>
                                                <input
                                                    type="text"
                                                    value={newProp.condominio}
                                                    onChange={e => setNewProp({ ...newProp, condominio: formatCurrency(e.target.value) })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all"
                                                    placeholder="R$ 0,00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">IPTU Mensal</label>
                                                <input
                                                    type="text"
                                                    value={newProp.iptu}
                                                    onChange={e => setNewProp({ ...newProp, iptu: formatCurrency(e.target.value) })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all"
                                                    placeholder="R$ 0,00"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Tipo Imóvel</label>
                                                <select value={newProp.tipo} onChange={e => setNewProp({ ...newProp, tipo: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all">
                                                    <option>Apto</option>
                                                    <option>Casa</option>
                                                    <option>Cobertura</option>
                                                    <option>Terreno</option>
                                                    <option>Comercial</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 3: Características */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            <h4 className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Ficha Técnica</h4>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Quartos</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={newProp.quartos}
                                                    onChange={e => setNewProp({ ...newProp, quartos: e.target.value.replace(/\D/g, '') as any })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Banheiros</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={newProp.banheiros}
                                                    onChange={e => setNewProp({ ...newProp, banheiros: e.target.value.replace(/\D/g, '') as any })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Vagas</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={newProp.vagas}
                                                    onChange={e => setNewProp({ ...newProp, vagas: e.target.value.replace(/\D/g, '') as any })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Área Útil</label>
                                                <input type="text" value={newProp.area} onChange={e => setNewProp({ ...newProp, area: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all" placeholder="Ex: 80m²" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Link Vídeo Tour (YouTube/Vimeo)</label>
                                                <input type="url" value={newProp.video_url} onChange={e => setNewProp({ ...newProp, video_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all" placeholder="https://..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Status Interno</label>
                                                <select value={newProp.status} onChange={e => setNewProp({ ...newProp, status: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-blue-500 outline-none transition-all font-bold">
                                                    <option>ATIVO</option>
                                                    <option>RESERVADO</option>
                                                    <option>VENDIDO</option>
                                                    <option>INATIVO</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest ml-1">Descrição Comercial</label>
                                            <textarea rows={4} value={newProp.descricao} onChange={e => setNewProp({ ...newProp, descricao: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none shadow-inner" placeholder="Descreva os pontos fortes do imóvel..." />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row gap-4">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 rounded-2xl border border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex-1">Cancelar</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-12 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 flex-2">Salvar no Inventário</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
