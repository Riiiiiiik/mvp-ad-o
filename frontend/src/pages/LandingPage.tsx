import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PROPERTY_CATEGORIES } from '../constants/properties';

interface PropertyImage {
    id: number;
    image_url: string;
    thumb_url?: string;
    ordem?: number;
}

interface Property {
    id: number;
    titulo: string;
    descricao?: string;
    preco?: string;
    localizacao?: string;
    tipo?: string;
    quartos?: number;
    banheiros?: number;
    vagas?: number;
    area?: string;
    status: string;
    main_image_url?: string;
    thumb_image_url?: string;
    is_destaque: number;
    condominio?: string;
    iptu?: string;
    video_url?: string;
    images?: PropertyImage[];
}

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

const ALLOTMENTS_DATA = [
    {
        name: 'Portal do Lago',
        history: 'O Portal do Lago é um marco de sofisticação e contato com a natureza em Goiás. Um projeto que prioriza a qualidade de vida, oferecendo uma infraestrutura completa com segurança 24h e áreas de lazer integradas ao ambiente natural.',
        videoUrl: 'https://www.youtube.com/embed/3m7Lmec9sgA'
    },
    {
        name: 'Aliança',
        history: 'O loteamento Aliança é o símbolo da união entre a modernidade e as raízes do interior goiano. Localizado em um ponto estratégico de expansão, o projeto foi desenhado para quem busca fortalecer laços familiares em um bairro seguro e planejado. Com ruas amplas e áreas verdes integradas, o Aliança é mais que um loteamento; é o pacto de qualidade de vida que você faz com o seu futuro em Goiás.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_aerial_view_1767185824851.png'
    },
    {
        name: 'Residencial Eldorado',
        history: 'Como o primeiro bairro planejado verticalmente de Goiânia, o Residencial Eldorado é um ícone de inovação urbana. Localizado no coração da região sudoeste, o bairro oferece uma vida dinâmica em torno da Avenida Milão, onde o lazer e a conveniência se unem em um ambiente moderno e valorizado. Ideal para famílias que buscam infraestrutura completa e qualidade de vida superior.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_leisure_area_1767185840623.png'
    },
    {
        name: 'Serra Verde III',
        history: 'O Serra Verde III representa o ápice da exclusividade em harmonia com a natureza. Situado em uma região de topografia privilegiada, o empreendimento oferece uma vista panorâmica permanente e o ar puro que só as áreas preservadas proporcionam. É a terceira e mais refinada etapa de um legado de sucesso, consolidando-se como o refúgio perfeito para famílias que buscam tranquilidade sem abrir mão da sofisticação.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_aerial_view_1767185824851.png'
    },
    {
        name: 'Jardim Mariana II',
        history: 'Localizado em Firminópolis, o Jardim Mariana II é o lugar ideal para quem busca realizar o sonho da casa própria em um ambiente tranquilo e familiar. Com infraestrutura preparada e localização estratégica, o loteamento oferece a paz do interior com a segurança de um investimento sólido.',
        videoUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FAliancaEmpreendimentos%2Fvideos%2F375555543340957%2F&show_text=0&t=0',
        imageUrl: ''
    },
    {
        name: 'Vale dos Sonhos',
        history: 'O Residencial Vale dos Sonhos, localizado na promissora região de Goianésia, Goiás, é o destino perfeito para quem busca a paz da vida rural com a vantagem de um investimento sólido. Próximo à BR-060/153, o loteamento oferece condições facilitadas para transformar o sonho da moradia tranquila em realidade, unindo segurança, acessibilidade e o contato direto com a natureza.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_leisure_area_1767185840623.png'
    },
    {
        name: 'Residencial América',
        history: 'O Jardim América em Porangatu é a definição de um bairro planejado para o futuro. Com infraestrutura completa e iluminação em LED, o loteamento se destaca pelo lazer excepcional, incluindo lago privativo, pista de caminhada e quadras esportivas. Estrategicamente localizado próximo à BR-153, é a escolha ideal para quem busca modernidade, segurança e uma valorização garantida na região Sul da cidade.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_aerial_view_1767185824851.png'
    },
    {
        name: 'Jardim Primavera',
        history: 'Com mais de três décadas de história na região Noroeste de Goiânia, o Jardim Primavera nasceu da transformação da antiga Fazenda São Domingos. De origens agrícolas para um vibrante espaço urbano, o bairro simboliza a expansão e o amadurecimento da capital. Consolidado e repleto de tradição, o loteamento é uma escolha segura para quem valoriza raízes fortes e o desenvolvimento constante de uma comunidade acolhedora.',
        videoUrl: '',
        imageUrl: 'C:/Users/Rik/.gemini/antigravity/brain/eb6bf96d-0f0e-417b-bef6-da820855a4bf/luxury_allotment_leisure_area_1767185840623.png'
    }
];

// Helper para Embed de Vídeo
const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
};

export default function LandingPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [leadName, setLeadName] = useState('');
    const [leadWhatsapp, setLeadWhatsapp] = useState('');
    const [selectedAllotment, setSelectedAllotment] = useState<typeof ALLOTMENTS_DATA[0] | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('Tipo de imóvel');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [activePhoto, setActivePhoto] = useState<string>('');
    const [showVideo, setShowVideo] = useState(false);

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedProperty?.images || selectedProperty.images.length === 0) return;
        const currentIndex = selectedProperty.images.findIndex(img => img.image_url === activePhoto);
        const nextIndex = (currentIndex + 1) % selectedProperty.images.length;
        setActivePhoto(selectedProperty.images[nextIndex].image_url);
        setShowVideo(false);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedProperty?.images || selectedProperty.images.length === 0) return;
        const currentIndex = selectedProperty.images.findIndex(img => img.image_url === activePhoto);
        const prevIndex = (currentIndex - 1 + selectedProperty.images.length) % selectedProperty.images.length;
        setActivePhoto(selectedProperty.images[prevIndex].image_url);
        setShowVideo(false);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/public/config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error('Error fetching site config:', err));
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/properties')
            .then(res => res.json())
            .then(data => setProperties(data))
            .catch(err => console.error('Error fetching properties:', err));
    }, []);

    const handleSearch = (typeOverride?: string) => {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const currentType = typeOverride !== undefined ? typeOverride : selectedType;

        fetch(`http://127.0.0.1:8000/api/public/config`).then(() => { // Dummy chained valid prompt if needed, but actually just fetch properties
            fetch(`http://127.0.0.1:8000/api/properties${query}`)
                .then(res => res.json())
                .then(data => {
                    let filtered = data;
                    if (currentType !== 'Tipo de imóvel') {
                        filtered = data.filter((p: Property) => p.tipo === currentType);
                    }
                    setProperties(filtered);
                    document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(err => console.error('Error searching properties:', err));
        });
    };


    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const digits = leadWhatsapp.replace(/\D/g, '');
        if (digits.length < 10) {
            alert('Por favor, insira um WhatsApp válido com DDD.');
            return;
        }

        setStatus('loading');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: leadName,
                    whatsapp: leadWhatsapp,
                    origem: 'Landing Page v2'
                }),
            });

            if (!response.ok) throw new Error('Failed to submit');
            setStatus('success');
            setLeadName('');
            setLeadWhatsapp('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const activeProperties = properties.filter(p => p.status === 'ATIVO');
    const highlightedProperties = activeProperties.filter(p => p.is_destaque === 1);

    return (
        <div className={`min-h-screen ${selectedAllotment ? 'overflow-hidden' : ''}`}>
            {/* Navbar */}
            <Navbar />

            {/* Modal de Loteamento */}
            {selectedAllotment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
                        onClick={() => setSelectedAllotment(null)}
                    ></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/10">
                        <button
                            onClick={() => setSelectedAllotment(null)}
                            className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Lateral do Vídeo/Imagem */}
                        <div className="w-full md:w-3/5 bg-slate-100 dark:bg-black h-64 md:h-auto relative overflow-hidden">
                            {selectedAllotment.videoUrl ? (
                                <iframe
                                    className="w-full h-full"
                                    src={selectedAllotment.videoUrl.includes('?')
                                        ? `${selectedAllotment.videoUrl}&autoplay=1`
                                        : `${selectedAllotment.videoUrl}?autoplay=1`}
                                    title={selectedAllotment.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : selectedAllotment.imageUrl ? (
                                <img
                                    src={selectedAllotment.imageUrl}
                                    alt={selectedAllotment.name}
                                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
                                    onError={(e) => {
                                        // Fallback if local path fails
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 font-black text-4xl opacity-10">
                                    ADÃO SILVA
                                </div>
                            )}
                        </div>

                        {/* Conteúdo do Texto */}
                        <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto">
                            <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Loteamento</span>
                            <h2 className="text-3xl md:text-5xl font-black text-brand-dark dark:text-white mb-6 tracking-tighter leading-none">
                                {selectedAllotment.name}
                            </h2>
                            <div className="h-1 w-20 bg-brand-primary mb-8 rounded-full"></div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                    {selectedAllotment.history || 'Em breve, mais detalhes sobre este empreendimento exclusivo.'}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Interessado neste loteamento?</p>
                                <button
                                    onClick={() => {
                                        setSelectedAllotment(null);
                                        document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
                                >
                                    Solicitar Tabela de Preços
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {config?.hero_image_url ? (
                        <img
                            src={config.hero_image_url || '/hero-bg-4k.png'}
                            alt="Luxury Hero"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/hero-bg-4k.png';
                            }}
                        />
                    ) : (
                        <img
                            src="/hero-bg-4k.png"
                            alt="Luxury Hero"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/20 to-brand-dark z-10" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-20 w-full text-center">
                    <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none uppercase drop-shadow-2xl">
                        {config?.hero_title?.split(' ')[0] || 'ADÃO'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-200">
                            {config?.hero_title?.split(' ').slice(1).join(' ') || 'SILVA'}
                        </span>
                    </h1>
                    <p className="text-xl md:text-3xl text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-lg opacity-90">
                        {config?.hero_subtitle || 'Imóveis de Luxo & Investimentos Exclusivos'}
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl shadow-slate-200 dark:shadow-black/20 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
                        <div className="flex-1 flex items-center px-4 w-full">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Bairro ou Código"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-white font-medium placeholder-gray-400"
                            />
                        </div>
                        <div className="hidden md:block w-px h-10 bg-gray-100 mx-2"></div>
                        <div className="flex-1 hidden md:flex items-center px-4">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-slate-600 font-medium cursor-pointer"
                            >
                                <option>Tipo de imóvel</option>
                                <option>Apartamento</option>
                                <option>Casa</option>
                                <option>Cobertura</option>
                                <option>Terreno</option>
                                <option>Comercial</option>
                            </select>
                        </div>
                        <button
                            onClick={() => handleSearch()}
                            className="bg-brand-primary text-white p-4 md:px-8 rounded-xl md:rounded-full hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 w-full md:w-auto"
                        >
                            <span className="md:hidden font-bold">Buscar Imóveis</span>
                            <svg className="hidden md:block w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8">
                        {PROPERTY_CATEGORIES.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => {
                                    if (cat.id === 'LOTE') {
                                        document.getElementById('loteamentos')?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        setSelectedType(cat.label);
                                        handleSearch(cat.label);
                                    }
                                }}
                                className="group cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 flex items-center justify-center text-2xl group-hover:-translate-y-2 transition-all group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20">
                                    {cat.icon}
                                </div>
                                <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                        <button
                            onClick={() => document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 text-sm"
                        >
                            Explorar Portfólio
                        </button>
                    </div>
                </div>
            </section>


            {/* Catalog Section */}
            <section id="imoveis" className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Lançamentos em Destaque</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">As melhores oportunidades curadas por especialistas.</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedType('Tipo de imóvel');
                                handleSearch('Tipo de imóvel');
                            }}
                            className="hidden md:block text-brand-primary font-black text-xs uppercase tracking-widest border-b-2 border-brand-primary pb-1 hover:text-brand-dark hover:border-brand-dark transition-all"
                        >
                            Ver todos
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(highlightedProperties.length > 0 ? highlightedProperties : activeProperties.slice(0, 6)).map(prop => (
                            <div
                                key={prop.id}
                                onClick={() => {
                                    setSelectedProperty(prop);
                                    setActivePhoto(prop.main_image_url || '');
                                }}
                                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl shadow-slate-100 dark:shadow-black/20 hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer"
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <picture>
                                        <source srcSet={prop.thumb_image_url || prop.main_image_url} media="(max-width: 600px)" />
                                        <img
                                            src={prop.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                                            alt={prop.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        />
                                    </picture>
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="bg-brand-dark/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {prop.tipo}
                                        </div>
                                        {prop.is_destaque === 1 && (
                                            <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                                                Destaque
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-3xl text-white">
                                            <p className="font-black text-xl tracking-tighter">{prop.preco || 'Sob consulta'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">{prop.localizacao}</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight group-hover:text-brand-primary transition-colors">{prop.titulo}</h3>

                                    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5 pt-6">
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Área</p>
                                            <p className="font-black text-slate-800 dark:text-slate-200">{prop.area || '-'}</p>
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quartos</p>
                                            <p className="font-black text-slate-800 dark:text-slate-200">{prop.quartos || '0'}</p>
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Banheiros</p>
                                            <p className="font-black text-slate-800 dark:text-slate-200">{prop.banheiros || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Allotments Section (Loteamentos) */}
            <section id="loteamentos" className="py-20 bg-gray-50 dark:bg-brand-dark border-t border-gray-100 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Loteamentos</h2>
                            <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
                        </div>
                        <p className="text-slate-500 font-medium font-serif italic">Tradição em urbanismo e valorização.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80">
                        {ALLOTMENTS_DATA.map((allotment, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedAllotment(allotment)}
                                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-center min-w-[200px] h-32 hover:shadow-md transition-all grayscale hover:grayscale-0 cursor-pointer group"
                            >
                                <span className="text-slate-400 font-black text-xs uppercase tracking-widest text-center group-hover:text-brand-primary transition-colors">
                                    {allotment.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Capture Section */}
            <section id="lead-capture" className="py-24 bg-brand-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary opacity-10 skew-x-12 translate-x-1/2"></div>
                <div className="max-w-5xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">
                            Ainda não encontrou o que procurava?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Estamos prontos para fazer um filtro personalizado para você. Deixe seu contato e receba uma curadoria exclusiva em poucos minutos.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 transition-colors">
                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-2">Sucesso!</h3>
                                <p className="text-slate-500 font-medium">Um especialista entrará em contato em breve.</p>
                                <button onClick={() => setStatus('idle')} className="mt-8 text-brand-primary font-black text-xs uppercase tracking-widest border-b-2 border-brand-primary/10 hover:border-brand-primary transition-all pb-1">Fazer nova consulta</button>
                            </div>
                        ) : (
                            <form onSubmit={handleLeadSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Seu Nome Completo</label>
                                    <input
                                        required
                                        type="text"
                                        value={leadName}
                                        onChange={(e) => setLeadName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-slate-800"
                                        placeholder="Ex: João da Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">WhatsApp de Contato</label>
                                    <input
                                        required
                                        type="tel"
                                        value={leadWhatsapp}
                                        onChange={(e) => setLeadWhatsapp(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-slate-800 dark:text-white"
                                        placeholder="(11) 98765-4321"
                                    />
                                </div>
                                <button
                                    disabled={status === 'loading'}
                                    className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black py-4 rounded-xl shadow-lg shadow-red-200 transition-all uppercase tracking-widest text-sm"
                                >
                                    {status === 'loading' ? 'Enviando...' : 'Pedir consultoria grátis'}
                                </button>
                                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atendimento 24h em tempo real</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer config={config} />

            {/* Modal de Detalhes do Imóvel */}
            {selectedProperty && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
                        onClick={() => setSelectedProperty(null)}
                    ></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[92vh] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/10">
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div
                            className="w-full md:w-3/5 bg-slate-100 dark:bg-black relative group/gallery overflow-hidden flex flex-col h-[40vh] md:h-auto"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {showVideo && selectedProperty.video_url ? (
                                <iframe
                                    src={getEmbedUrl(selectedProperty.video_url)}
                                    className="w-full h-full"
                                    title="Video Tour"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <>
                                    <img
                                        src={activePhoto || selectedProperty.main_image_url}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                        alt={selectedProperty.titulo}
                                    />
                                    {/* Navigation Buttons Removed for Swipe */}

                                </>
                            )}

                            {/* Galeria de Thumbnails no Modal */}
                            {selectedProperty.images && selectedProperty.images.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-black/20 backdrop-blur-md rounded-2xl max-w-[90%] overflow-x-auto no-scrollbar scroll-smooth z-30">
                                    {(selectedProperty.images || []).map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActivePhoto(img.image_url);
                                                setShowVideo(false);
                                            }}
                                            className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activePhoto === img.image_url && !showVideo ? 'border-brand-primary scale-110 shadow-lg' : 'border-white/20 hover:border-white/50'}`}
                                        >
                                            <img src={img.thumb_url || img.image_url} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-2/5 p-8 md:p-14 overflow-y-auto bg-white dark:bg-slate-900">
                            <div className="mb-8">
                                <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-3 block">Detalhes Exclusivos</span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">{selectedProperty.titulo}</h2>
                                <p className="text-brand-primary font-black text-2xl md:text-3xl tracking-tighter">{selectedProperty.preco || 'Sob consulta'}</p>
                            </div>

                            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
                                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl min-w-[100px] text-center">
                                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Área</p>
                                    <p className="font-black text-slate-800 dark:text-white text-lg">{selectedProperty.area || '-'}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl min-w-[100px] text-center">
                                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Quartos</p>
                                    <p className="font-black text-slate-800 dark:text-white text-lg">{selectedProperty.quartos || '0'}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl min-w-[100px] text-center">
                                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Banheiros</p>
                                    <p className="font-black text-slate-800 dark:text-white text-lg">{selectedProperty.banheiros || '0'}</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
                                    <svg className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Localização</p>
                                        <p className="font-bold text-slate-800 dark:text-white">{selectedProperty.localizacao}</p>
                                    </div>
                                </div>

                                <div className="prose dark:prose-invert max-w-none border-t border-slate-100 dark:border-white/5 pt-8">
                                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{selectedProperty.descricao}</p>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-6 border-t border-slate-100 dark:border-white/5">
                                <button
                                    onClick={() => {
                                        setSelectedProperty(null);
                                        document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-brand-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Falar com Especialista
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
