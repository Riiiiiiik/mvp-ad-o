import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PROPERTY_CATEGORIES } from '../constants/properties';
import { supabase } from '../supabaseClient';
import type { Property } from '../types/property';
import { useProperties } from '../hooks/useProperties';


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
        imageUrl: 'https://images.unsplash.com/photo-1590483734724-383b853b317d?auto=format&fit=crop&w=1200'
    },
    {
        name: 'Residencial Eldorado',
        history: 'Como o primeiro bairro planejado verticalmente de Goiânia, o Residencial Eldorado é um ícone de inovação urbana. Localizado no coração da região sudoeste, o bairro oferece uma vida dinâmica em torno da Avenida Milão, onde o lazer e a conveniência se unem em um ambiente moderno e valorizado. Ideal para famílias que buscam infraestrutura completa e qualidade de vida superior.',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200'
    },
    {
        name: 'Serra Verde III',
        history: 'O Serra Verde III representa o ápice da exclusividade em harmonia com a natureza. Situado em uma região de topografia privilegiada, o empreendimento oferece uma vista panorâmica permanente e o ar puro que só as áreas preservadas proporcionam. É a terceira e mais refinada etapa de um legado de sucesso, consolidando-se como o refúgio perfeito para famílias que buscam tranquilidade sem abrir mão da sofisticação.',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200'
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
        imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200'
    },
    {
        name: 'Residencial América',
        history: 'O Jardim América em Porangatu é a definição de um bairro planejado para o futuro. Com infraestrutura completa e iluminação em LED, o loteamento se destaca pelo lazer excepcional, incluindo lago privativo, pista de caminhada e quadras esportivas. Estrategicamente localizado próximo à BR-153, é a escolha ideal para quem busca modernidade, segurança e uma valorização garantida na região Sul da cidade.',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200'
    },
    {
        name: 'Jardim Primavera',
        history: 'Com mais de três décadas de história na região Noroeste de Goiânia, o Jardim Primavera nasceu da transformação da antiga Fazenda São Domingos. De origens agrícolas para um vibrante espaço urbano, o bairro simboliza a expansão e o amadurecimento da capital. Consolidado e repleto de tradição, o loteamento é uma escolha segura para quem valoriza raízes fortes e o desenvolvimento constante de uma comunidade acolhedora.',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80'
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
    const { properties, fetchProperties } = useProperties();
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
        supabase.from('site_config').select('*').single()
            .then(({ data, error }) => {
                if (data) setConfig(data);
                if (error) console.error('Error fetching site config:', error);
            });
    }, []);

    useEffect(() => {
        fetchProperties({ status: 'ATIVO' });
    }, [fetchProperties]);

    const handleSearch = async (typeOverride?: string) => {
        const currentType = typeOverride !== undefined ? typeOverride : selectedType;
        await fetchProperties({
            searchTerm,
            type: currentType,
            status: 'ATIVO'
        });
        document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
    };


    // Efeito para garantir máscara no WhatsApp (útil para auto-completar)
    useEffect(() => {
        const digits = leadWhatsapp.replace(/\D/g, '');
        if (digits.length > 0 && !leadWhatsapp.includes('(') && digits.length >= 2) {
            setLeadWhatsapp(formatPhoneNumber(digits));
        }
    }, [leadWhatsapp]);

    const formatPhoneNumber = (v: string) => {
        const digits = v.replace(/\D/g, "");
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        // Limitar a 11 dígitos para o formato (00) 00000-0000
        const limited = digits.slice(0, 11);
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove tudo que não é dígito antes de formatar
        const input = e.target.value.replace(/\D/g, '');
        const formatted = formatPhoneNumber(input);
        setLeadWhatsapp(formatted);
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const digits = leadWhatsapp.replace(/\D/g, '');
        console.log('Lead submission attempt:', { nome: leadName, whatsapp: leadWhatsapp, digits_length: digits.length });

        if (digits.length < 10) {
            alert('Por favor, insira um WhatsApp válido com DDD.');
            return;
        }

        setStatus('loading');
        try {
            console.log('Sending to Supabase...');
            const { data, error } = await supabase.from('leads').insert([{
                nome: leadName,
                whatsapp: leadWhatsapp,
                origem: 'Landing Page v2'
            }]).select();

            if (error) {
                console.error('Supabase Error:', error);
                throw error;
            }

            console.log('Supabase Success:', data);
            setStatus('success');
            setLeadName('');
            setLeadWhatsapp('');
        } catch (error) {
            console.error('Submission Catch Error:', error);
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
                    <h1 className="text-5xl md:text-9xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.9] md:leading-none uppercase drop-shadow-2xl">
                        {config?.hero_title?.split(' ')[0] || 'ADÃO'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-200">
                            {config?.hero_title?.split(' ').slice(1).join(' ') || 'SILVA'}
                        </span>
                    </h1>
                    <p className="text-lg md:text-3xl text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto mb-8 md:mb-12 drop-shadow-lg opacity-90 px-4 md:px-0">
                        {config?.hero_subtitle || 'Imóveis de Luxo & Investimentos Exclusivos'}
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 md:p-3 rounded-3xl md:rounded-full shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
                        <div className="flex-1 flex items-center px-4 w-full h-14 md:h-auto">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Bairro ou Código"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-white font-bold text-sm md:text-base placeholder-gray-400"
                            />
                        </div>
                        <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-white/10 mx-2"></div>
                        <div className="hidden md:flex flex-1 items-center px-4">
                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-slate-600 dark:text-slate-300 font-bold text-sm cursor-pointer"
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
                            className="bg-brand-primary text-brand-dark md:text-white h-14 md:h-auto md:px-8 rounded-2xl md:rounded-full hover:bg-brand-dark hover:text-white transition-all shadow-lg shadow-brand-primary/20 w-full md:w-auto font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                        >
                            <span>Explorar Imóveis</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8">
                        {PROPERTY_CATEGORIES.slice(0, 4).map(cat => (
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
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 flex items-center justify-center text-xl md:text-2xl group-hover:-translate-y-2 transition-all group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20">
                                    {cat.icon}
                                </div>
                                <span className="mt-2 md:mt-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Catalog Section */}
            <section id="imoveis" className="pt-20 md:pt-32 pb-16 md:pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Lançamentos em Destaque</h2>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-2">As melhores oportunidades curadas por especialistas.</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedType('Tipo de imóvel');
                                handleSearch('Tipo de imóvel');
                            }}
                            className="text-brand-primary font-black text-[10px] md:text-xs uppercase tracking-widest border-b-2 border-brand-primary pb-1 hover:text-brand-dark hover:border-brand-dark transition-all"
                        >
                            Ver todos os imóveis
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {(highlightedProperties.length > 0 ? highlightedProperties : activeProperties.slice(0, 6)).map(prop => (
                            <div
                                key={prop.id}
                                onClick={() => {
                                    setSelectedProperty(prop);
                                    setActivePhoto(prop.main_image_url || '');
                                }}
                                className="group bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                            >
                                <div className="relative h-64 md:h-72 overflow-hidden">
                                    <picture>
                                        <source srcSet={prop.thumb_image_url || prop.main_image_url} media="(max-width: 600px)" />
                                        <img
                                            src={prop.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                                            alt={prop.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        />
                                    </picture>
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
                                        <div className="bg-brand-dark/80 backdrop-blur-md text-white px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                            {prop.tipo}
                                        </div>
                                        {prop.is_destaque === 1 && (
                                            <div className="bg-amber-500 text-white px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                Destaque
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                                        <div className="bg-black/30 backdrop-blur-md border border-white/20 px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl text-white">
                                            <p className="font-black text-lg md:text-xl tracking-tighter">{prop.preco || 'Sob consulta'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <p className="text-[9px] md:text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">{prop.localizacao}</p>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">{prop.titulo}</h3>

                                    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5 pt-6">
                                        <div className="text-center px-1">
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Área</p>
                                            <p className="font-black text-sm md:text-base text-slate-800 dark:text-slate-200">{prop.area || '-'}</p>
                                        </div>
                                        <div className="text-center px-1">
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dorms</p>
                                            <p className="font-black text-sm md:text-base text-slate-800 dark:text-slate-200">{prop.quartos || '0'}</p>
                                        </div>
                                        <div className="text-center px-1">
                                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suítes</p>
                                            <p className="font-black text-sm md:text-base text-slate-800 dark:text-slate-200">{prop.banheiros || '0'}</p>
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
            <section id="lead-capture" className="py-20 md:py-24 bg-brand-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary opacity-5 md:opacity-10 skew-x-12 translate-x-1/2"></div>
                <div className="max-w-5xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">
                            Não encontrou o que procurava?
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg mb-8 font-medium">
                            Nossa equipe de especialistas está pronta para realizar uma curadoria exclusiva para o seu perfil de investimento.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 transition-colors">
                        {status === 'success' ? (
                            <div className="text-center py-10 animate-in zoom-in duration-500">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-brand-dark dark:text-white mb-2 uppercase tracking-tighter">Informações Enviadas!</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Em instantes um consultor entrará em contato com você via WhatsApp.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-brand-primary font-black text-[10px] md:text-xs uppercase tracking-widest border-b-2 border-brand-primary/10 hover:border-brand-primary transition-all pb-1"
                                >
                                    Fazer novo pedido de curadoria
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleLeadSubmit} className="space-y-4 md:space-y-6">
                                {status === 'error' && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Ops! Algo deu errado. Por favor, tente novamente ou nos ligue diretamente.
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Seu Nome Completo</label>
                                    <input
                                        required
                                        type="text"
                                        value={leadName}
                                        onChange={(e) => setLeadName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 md:px-5 md:py-3.5 focus:ring-2 focus:ring-brand-primary outline-none text-slate-800 dark:text-white font-bold transition-all"
                                        placeholder="Ex: Rikelme Silva"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">WhatsApp de Contato</label>
                                    <input
                                        required
                                        type="tel"
                                        value={leadWhatsapp}
                                        onChange={handleWhatsappChange}
                                        maxLength={15}
                                        className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 md:px-5 md:py-3.5 focus:ring-2 focus:ring-brand-primary outline-none text-slate-800 dark:text-white font-bold transition-all"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <button
                                    disabled={status === 'loading'}
                                    className={`w-full font-black py-4 md:py-5 rounded-xl shadow-lg transition-all uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 ${status === 'loading'
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-brand-primary text-brand-dark hover:bg-brand-dark hover:text-white shadow-brand-primary/20'
                                        }`}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : 'PEDIR CONSULTORIA GRÁTIS'}
                                </button>
                                <p className="text-center text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
                                    ATENDIMENTO 24H EM TEMPO REAL
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer config={config} />

            {/* Modal de Detalhes do Imóvel */}
            {selectedProperty && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-brand-dark/98 backdrop-blur-xl"
                        onClick={() => setSelectedProperty(null)}
                    ></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full h-full md:h-auto md:max-w-6xl md:max-h-[92vh] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/5">
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-xl"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div
                            className="w-full md:w-3/5 bg-slate-100 dark:bg-black relative group/gallery overflow-hidden flex flex-col h-[45vh] md:h-auto shrink-0"
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
                                <img
                                    src={activePhoto || selectedProperty.main_image_url}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    alt={selectedProperty.titulo}
                                />
                            )}

                            {/* Galeria de Thumbnails no Modal */}
                            {selectedProperty.images && selectedProperty.images.length > 1 && (
                                <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2 p-3 z-30 overflow-x-auto no-scrollbar">
                                    <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-2xl max-w-full">
                                        {(selectedProperty.images || []).map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setActivePhoto(img.image_url);
                                                    setShowVideo(false);
                                                }}
                                                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activePhoto === img.image_url && !showVideo ? 'border-brand-primary scale-105 shadow-lg' : 'border-white/20'}`}
                                            >
                                                <img src={img.thumb_url || img.image_url} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-6 md:p-14 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
                            <div className="mb-8">
                                <span className="text-brand-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block">Destaque Exclusivo</span>
                                <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tighter leading-[1.1] md:leading-none uppercase">{selectedProperty.titulo}</h2>
                                <p className="text-brand-primary font-black text-xl md:text-3xl tracking-tighter">{selectedProperty.preco || 'Sob consulta'}</p>
                            </div>

                            <div className="flex gap-3 md:gap-4 mb-8">
                                <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-3xl text-center border border-slate-100 dark:border-white/5">
                                    <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Área Total</p>
                                    <p className="font-black text-slate-800 dark:text-white text-base md:text-lg">{selectedProperty.area || '-'}</p>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-3xl text-center border border-slate-100 dark:border-white/5">
                                    <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Dormitórios</p>
                                    <p className="font-black text-slate-800 dark:text-white text-base md:text-lg">{selectedProperty.quartos || '0'}</p>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-3xl text-center border border-slate-100 dark:border-white/5">
                                    <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 mb-1">Suítes</p>
                                    <p className="font-black text-slate-800 dark:text-white text-base md:text-lg">{selectedProperty.banheiros || '0'}</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-start gap-4 text-slate-600 dark:text-slate-400">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Localização</p>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm md:text-base">{selectedProperty.localizacao}</p>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none border-t border-slate-100 dark:border-white/5 pt-6 md:pt-8">
                                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg leading-relaxed font-medium">
                                        {selectedProperty.descricao}
                                    </p>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pt-4 pb-2 border-t border-slate-100 dark:border-white/5">
                                <button
                                    onClick={() => {
                                        setSelectedProperty(null);
                                        document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full bg-brand-primary text-brand-dark py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-brand-dark hover:text-white transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Agendar Visita Exclusiva
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
