import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Post {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    tag: string;
    author: string;
    date: string;
}

const BLOG_POSTS: Post[] = [
    {
        id: 1,
        tag: 'Especial: Projeção 2025',
        title: 'Goiás: Onde investir no mercado de alto padrão nos próximos 12 meses?',
        excerpt: 'Análise profunda sobre os vetores de valorização em Goiânia e região metropolitana, antecipando as tendências que dominarão o ano de 2025.',
        author: 'Redação Adão Silva',
        date: '30 Dez, 2024',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200',
        content: `
            <p>O mercado imobiliário de luxo em Goiás vive um momento de maturidade sem precedentes. Enquanto outros mercados nacionais enfrentam volatilidade, o eixo **Goiânia - Aparecida** demonstra uma resiliência fundamentada em infraestrutura e expansão urbana planejada. Para o investidor que busca segurança e rentabilidade, entender os fundamentos de 2025 é crucial.</p>
            
            <h3>O Eixo de Ouro: Setor Marista e Jardim Goiás</h3>
            <p>O Setor Marista continua sendo o epicentro da valorização. Com a saturação de terrenos, a escassez se torna o motor do preço por m². Projetamos que lançamentos exclusivos no Marista alcancem patamares de valorização de até 18% no primeiro ano pós-entrega. Já o Jardim Goiás, impulsionado pelo Parque Flamboyant, consolida-se como o destino preferido para quem busca altíssima liquidez, com uma vacância quase inexistente em imóveis premium.</p>
            
            <h3>A Ascensão dos Condomínios de "Pocket Park"</h3>
            <p>Uma tendência clara para 2025 é o conceito de Pocket Park dentro dos empreendimentos. Não se trata mais apenas de uma varanda gourmet, mas de verdadeiras "ilhas de Cerrado" suspensas. Empreendimentos que oferecem essa integração profunda com a natureza nativa estão atraindo um público disposto a pagar um prêmio de até 25% sobre o valor médio da região.</p>
            
            <h3>Dados e Projeções Financeiras</h3>
            <ul>
                <li><strong>Valorização Média Estimada:</strong> 12% a 15% ao ano para imóveis na planta.</li>
                <li><strong>Retorno sobre Aluguel (Yield):</strong> 0.6% a 0.8% mensal em unidades "Compact Luxury".</li>
                <li><strong>Vetor de Expansão:</strong> Região Sul da Grande Goiânia, com novos condomínios horizontais de ultra-padrão.</li>
            </ul>
 
            <p>Concluímos que 2025 será o ano do "Flight to Quality". O capital não irá apenas para onde há espaço, mas para onde há curadoria de design e inovação arquitetônica. Na Adão Silva Imóveis, acompanhamos cada hectare desse crescimento para garantir que seu próximo investimento seja não apenas um imóvel, mas um legado.</p>
        `
    },
    {
        id: 2,
        tag: 'Tecnologia',
        title: 'Cidades Inteligentes: Como a tecnologia molda o luxo real em Goiás.',
        excerpt: 'De domótica invisível a infraestrutura de recarga elétrica, descubra como a tecnologia se tornou o novo padrão ouro de valor imobiliário.',
        author: 'Felipe Amado',
        date: '28 Dez, 2024',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800',
        content: `
            <p>Antigamente, luxo era sinônimo de mármore e ouro. Hoje, o verdadeiro luxo é a invisibilidade da tecnologia servindo ao morador. Em Goiás, os novos lançamentos de alto padrão estão redefinindo o conceito de "Smart Living", transformando metros quadrados em dados inteligentes que geram conforto e economia.</p>
            
            <h3>A Era da Domótica Preditiva</h3>
            <p>Não falamos mais de ligar a luz pelo celular. Os empreendimentos mais modernos no Setor Bueno e Marista já contam com IA que aprende a rotina do morador. Ajuste de temperatura automático baseado na incidência solar do Cerrado, sistemas de som que acompanham o movimento e segurança biométrica multiespectral são agora requisitos básicos para o investidor moderno.</p>
            
            <h3>Eletromobilidade e Sustentabilidade Integrada</h3>
            <p>A infraestrutura para veículos elétricos (EV) deixou de ser um diferencial para se tornar um item de sobrevivência imobiliária. Unidades que não possuem pelo menos uma vaga com carregamento ultrarrápido individualizado sofrem uma depreciação perceptível na revenda. Além disso, a gestão de energia via Smart Grids internos permite uma redução de até 40% nas taxas condominiais, um fator decisivo para a liquidez a longo prazo.</p>
 
            <h3>O Impacto no Valor de Mercado</h3>
            <p>Estudos indicam que imóveis "full-tech" em Goiânia possuem um tempo de venda 30% menor do que imóveis tradicionais. O comprador atual valoriza a praticidade tanto quanto a localização. Na Adão Silva, nossa curadoria foca em ativos que já nascem preparados para a tecnologia de amanhã, protegendo seu patrimônio contra a obsolescência.</p>
        `
    },
    {
        id: 3,
        tag: 'Design',
        title: 'Curadoria de Design: Do minimalismo ao Biofílico no Cerrado.',
        excerpt: 'A arquitetura que respira: entenda como o design biofílico está revolucionando o bem-estar e o preço do m² nos bairros mais nobres.',
        author: 'Marina Costa',
        date: '25 Dez, 2024',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800',
        content: `
            <p>O design biofílico não é apenas colocar plantas em uma sala. É uma ciência baseada na necessidade biológica do ser humano de se conectar com a natureza. Em uma cidade dinâmica como Goiânia, o design que "respira" tornou-se o maior luxo contemporâneo, influenciando diretamente a saúde mental e a valorização patrimonial.</p>
            
            <h3>Integração Vertical e Luz Natural</h3>
            <p>Os novos projetos que estamos acompanhando utilizam a vegetação nativa do Cerrado como barreira térmica natural. Jardins verticais aut Irrigáveis e ventilação cruzada inteligente permitem que o uso de ar-condicionado seja reduzido drasticamente, criandoMicroclimas agradáveis mesmo nos dias mais quentes de Goiás. A transparência do vidro e o uso de materiais orgânicos como madeira certificada e pedra brutatrazem a sensação de "casa" para dentro do apartamento.</p>
            
            <h3>Arquitetura Sensorial</h3>
            <p>O foco mudou do visual para o sensorial. O toque dos materiais, a acústica que isola o ruído urbano e a luz zenital são os novos indicadores de qualidade. No Setor Bueno, vemos uma transição clara para edifícios-conceito que funcionam como verdadeiros spas urbanos. Quando você investe em um imóvel com design biofílico, você está investindo em 10 ou 15 anos a mais de relevância estética e funcional no mercado.</p>
 
            <h3>O Futuro do Morar</h3>
            <p>Acreditamos que a próxima década será marcada pelo retorno às origens. Imóveis que ignoram o ambiente local serão esquecidos. A curadoria da Adão Silva Imóveis prioriza projetos que respeitam a identidade de Goiás enquanto elevam o padrão de design global.</p>
        `
    },
    {
        id: 4,
        tag: 'Tendência',
        title: 'Apartamentos Garden: O fenômeno do "quintal" elevado em Goiânia.',
        excerpt: 'A busca por espaço e liberdade transformou os apartamentos garden nos ativos mais cobiçados do momento. Entenda por que eles são o novo porto seguro.',
        author: 'Ricardo Silva',
        date: '22 Dez, 2024',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800',
        content: `
            <p>Nos últimos anos, o comportamento do consumidor de luxo em Goiás mudou drasticamente. A necessidade de ar livre, sem abrir mão da segurança de um edifício, deu origem à explosão dos "Apartamentos Garden". Estas unidades, que ocupam geralmente os pavimentos inferiores e oferecem amplos terraços privativos, tornaram-se o objeto de desejo de famílias que buscam o melhor dos dois mundos.</p>
            
            <h3>Liberdade Privativa no Meio da Cidade</h3>
            <p>O diferencial de um garden não é apenas o tamanho, mas a possibilidade de ter um jardim real, uma piscina privativa ou um espaço para pets sem as limitações de uma casa de rua. No Setor Marista, onde a verticalização é intensa, o "quintal elevado" oferece uma sensação de liberdade que é raríssima. É o refúgio perfeito após um dia de trabalho intenso na capital goiana.</p>
            
            <h3>Valorização e Escassez</h3>
            <p>Como existem poucas unidades garden em cada empreendimento (geralmente apenas uma por prumada), a escassez dita o ritmo da valorização. Dados mostram que estas unidades tendem a valorizar 20% mais rápido que os apartamentos tipo. Para o investidor, é um ativo de baixa volatilidade; para o morador, é a máxima expressão de qualidade de vida urbana.</p>
 
            <h3>Para Quem é o Garden?</h3>
            <p>Ideal para famílias com crianças, donos de pets ou entusiastas do paisagismo. O garden permite a criação de espaços de lazer que seriam impossíveis em um apartamento convencional. Na Adão Silva Imóveis, possuímos uma lista exclusiva de unidades garden fora de mercado (off-market) nos melhores empreendimentos de Goiânia.</p>
        `
    },
    {
        id: 5,
        tag: 'Análise',
        title: 'O Fenômeno Setor Marista: Por que investir no epicentro do luxo?',
        excerpt: 'Uma radiografia completa do bairro que concentra o maior IDH e a maior densidade de m² premium do estado.',
        author: 'Redação Adão Silva',
        date: '20 Dez, 2024',
        image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800',
        content: `
            <p>O Setor Marista não é apenas um bairro de Goiânia; é um estado de espírito e um dos destinos de investimento mais seguros do Brasil. Com ruas arborizadas, gastronomia de classe mundial e os projetos arquitetônicos mais audaciosos do Centro-Oeste, o Marista é onde o sucesso encontra o seu lugar.</p>
            
            <h3>IDH de Primeiro Mundo</h3>
            <p>A região possui indicadores de qualidade de vida comparáveis a grandes capitais europeias. A concentração de serviços de alta gama — de escolas bilíngues a hospitais de referência — cria um ecossistema que se autoalimenta. Quem mora no Marista raramente quer sair, o que mantém a demanda sempre alta e a oferta sempre disputada.</p>
            
            <h3>A Vitrine da Arquitetura Nacional</h3>
            <p>O Marista tornou-se o campo de provas para os maiores arquitetos do país. Cada novo lançamento busca superar o anterior em termos de fachadas icônicas e soluções de engenharia. Isso gera uma renovação constante do tecido urbano, impedindo que o bairro envelheça. Pelo contrário, o Marista se reinventa a cada ano, atraindo novas marcas de luxo e boutiques exclusivas.</p>
 
            <h3>Fundamentos de Investimento</h3>
            <ul>
                <li><strong>Localização:</strong> Proximidade estratégica com os principais centros de negócios.</li>
                <li><strong>Segurança:</strong> Bairro monitorado e com forte presença de segurança privada.</li>
                <li><strong>Lifestyle:</strong> Acesso a pé aos melhores restaurantes e parques da cidade.</li>
            </ul>
 
            <p>Investir no Setor Marista é garantir um lugar na primeira fila do crescimento goiano. Na Adão Silva Imóveis, temos o conhecimento local necessário para identificar as melhores oportunidades de entrada neste bairro icônico, antes mesmo de chegarem ao grande público.</p>
        `
    }
];

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Auto-scroll to top when selecting post
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedPost]);

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-40 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs / Back button */}
                    {selectedPost && (
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="mb-8 flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Voltar para a lista
                        </button>
                    )}

                    {!selectedPost ? (
                        <div className="bg-brand-dark rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {/* Magazine Header */}
                            <div className="p-12 md:p-20 text-center relative overflow-hidden text-white bg-brand-dark">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-20 blur-[100px]"></div>
                                <p className="text-brand-primary/100 font-black text-xs uppercase tracking-[0.5em] mb-4">Curadoria Inteligente</p>
                                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Insights do Mercado</h2>
                                <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                                    Não entregamos apenas notícias. Analisamos dados, projeções urbanas e tendências de luxo para o seu próximo grande investimento em Goiás.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 md:p-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10 transition-colors">
                                {/* Featured Post */}
                                <div
                                    className="lg:col-span-2 group cursor-pointer"
                                    onClick={() => setSelectedPost(BLOG_POSTS[0])}
                                >
                                    <div className="relative h-96 rounded-3xl overflow-hidden mb-6">
                                        <img src={BLOG_POSTS[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Market Insight" />
                                        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-brand-dark/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-dark dark:text-white shadow-xl transition-colors">
                                            {BLOG_POSTS[0].tag}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-brand-dark dark:text-white mb-4 tracking-tighter group-hover:text-brand-primary transition-colors">
                                        {BLOG_POSTS[0].title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                        {BLOG_POSTS[0].excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        <span>{BLOG_POSTS[0].author}</span>
                                        <span className="w-1 h-1 bg-gray-300 dark:bg-white/10 rounded-full"></span>
                                        <span>{BLOG_POSTS[0].date}</span>
                                    </div>
                                </div>

                                {/* Side Posts */}
                                <div className="space-y-10">
                                    {BLOG_POSTS.slice(1, 3).map(post => (
                                        <div
                                            key={post.id}
                                            className="group cursor-pointer"
                                            onClick={() => setSelectedPost(post)}
                                        >
                                            <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                                                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={post.title} />
                                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-dark/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-brand-dark dark:text-white transition-colors">
                                                    {post.tag}
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-brand-dark dark:text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{post.excerpt}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* More Insights Grid */}
                                <div className="lg:col-span-3 grid md:grid-cols-2 gap-10 pt-10 border-t border-gray-100 dark:border-white/5">
                                    {BLOG_POSTS.slice(3).map(post => (
                                        <div
                                            key={post.id}
                                            className="group cursor-pointer flex gap-6 items-start"
                                            onClick={() => setSelectedPost(post)}
                                        >
                                            <div className="w-40 h-32 flex-shrink-0 rounded-2xl overflow-hidden relative">
                                                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={post.title} />
                                            </div>
                                            <div>
                                                <span className="text-brand-primary font-black text-[8px] uppercase tracking-widest mb-1 block">{post.tag}</span>
                                                <h4 className="text-lg font-black text-brand-dark dark:text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">
                                                    {post.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{post.excerpt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Grid */}
                                <div className="lg:col-span-3 grid md:grid-cols-3 gap-10 pt-10 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex gap-4 items-start group cursor-not-allowed">
                                        <div className="text-4xl font-black text-brand-primary/10">01</div>
                                        <div>
                                            <h5 className="font-black text-brand-dark dark:text-white mb-1">Manual do Vendedor</h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Como valorizar seu patrimônio em até 20% antes de anunciar.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start group cursor-not-allowed">
                                        <div className="text-4xl font-black text-brand-primary/10">02</div>
                                        <div>
                                            <h5 className="font-black text-brand-dark dark:text-white mb-1">Exclusividade Offline</h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Imóveis fora de mercado: O privilégio da curadoria direta.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start group cursor-not-allowed">
                                        <div className="text-4xl font-black text-brand-primary/10">03</div>
                                        <div>
                                            <h5 className="font-black text-brand-dark dark:text-white mb-1">Relatório Mensal</h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Assine nossa curadoria e receba o Radar de Oportunidades.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
                            {/* Article Header */}
                            <div className="mb-12">
                                <div className="w-20 h-2 bg-brand-primary mb-12 rounded-full"></div>
                                <span className="bg-brand-primary text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                                    {selectedPost.tag}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white mb-8 tracking-tighter leading-tight font-serif italic">
                                    {selectedPost.title}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
                                        {selectedPost.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-brand-dark dark:text-white font-black uppercase text-xs tracking-widest mb-1">{selectedPost.author}</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest transition-colors">Publicado em {selectedPost.date}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="relative h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
                                <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:font-medium">
                                <div
                                    className="blog-content space-y-8"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />
                            </div>

                            {/* Post Footer / Share */}
                            <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Gostou deste insight?</span>
                                    <button className="bg-brand-dark dark:bg-brand-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary dark:hover:bg-brand-dark transition-all">Compartilhar</button>
                                </div>
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="text-brand-primary font-extrabold text-xs uppercase tracking-widest border-b-2 border-slate-100 dark:border-white/10 hover:border-brand-primary transition-all pb-1"
                                >
                                    Ler outros artigos
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <Footer />

            <style>{`
                .blog-content h3 {
                    font-family: var(--font-serif);
                    font-style: italic;
                    font-size: 2.25rem;
                    line-height: 2.5rem;
                    color: var(--color-brand-dark);
                    margin-top: 3.5rem;
                    margin-bottom: 1.5rem;
                    transition: color 0.5s;
                }
                .dark .blog-content h3 {
                    color: white;
                }
                .blog-content p {
                    font-size: 1.125rem;
                    line-height: 2.1;
                    color: #475569;
                    transition: color 0.5s;
                }
                .dark .blog-content p {
                    color: #94a3b8;
                }
                .blog-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    color: #475569;
                    transition: color 0.5s;
                }
                .dark .blog-content ul {
                    color: #94a3b8;
                }
                .blog-content li {
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}
