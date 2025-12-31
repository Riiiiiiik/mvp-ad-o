import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LegalContent {
    title: string;
    sections: {
        subtitle: string;
        content: string;
    }[];
}

const CONTENT: Record<string, LegalContent> = {
    'privacidade': {
        title: 'Política de Privacidade',
        sections: [
            {
                subtitle: '1. Coleta de Dados',
                content: 'A Adão Silva Imóveis coleta informações pessoais apenas quando necessário para fornecer serviços a você. Coletamos dados como nome e WhatsApp através de nossos formulários de contato para fins de consultoria imobiliária.'
            },
            {
                subtitle: '2. Uso de Informações',
                content: 'As informações coletadas são utilizadas exclusivamente para entrar em contato com você sobre oportunidades imobiliárias, responder a dúvidas ou processar solicitações de consultoria. Não compartilhamos suas informações com terceiros para fins de marketing.'
            },
            {
                subtitle: '3. Proteção de Dados (LGPD)',
                content: 'Operamos em conformidade com a Lei Geral de Proteção de Dados (LGPD). Seus dados são armazenados em sistemas seguros e você tem o direito de solicitar a exclusão de seus dados a qualquer momento através de nossos canais de atendimento.'
            }
        ]
    },
    'termos': {
        title: 'Termos de Uso',
        sections: [
            {
                subtitle: '1. Aceitação dos Termos',
                content: 'Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. O uso do site é de sua inteira responsabilidade.'
            },
            {
                subtitle: '2. Precisão das Informações',
                content: 'Embora nos esforcemos para manter as informações de imóveis e loteamentos sempre atualizadas, não garantimos a precisão completa de todos os dados (preços, disponibilidade, metragens) sem consulta prévia com nossos especialistas.'
            },
            {
                subtitle: '3. Propriedade Intelectual',
                content: 'Todo o conteúdo deste site, incluindo logotipos, textos e imagens, é de propriedade exclusiva da Adão Silva Imóveis ou de seus fornecedores parceiros, sendo protegido por leis de direitos autorais.'
            }
        ]
    },
    'responsabilidade': {
        title: 'Responsabilidade Social',
        sections: [
            {
                subtitle: 'Compromisso com Goiás',
                content: 'A Adão Silva Imóveis entende que sua atuação vai além dos negócios. Temos um compromisso profundo com o desenvolvimento sustentável de São Luís de Montes Belos e de todo o estado de Goiás.'
            },
            {
                subtitle: 'Ética e Transparência',
                content: 'Valorizamos a transparência absoluta em todos os negócios imobiliários, garantindo que nossos clientes e parceiros operem em um ambiente de confiança e respeito mútuo.'
            },
            {
                subtitle: 'Ações Comunitárias',
                content: 'Apoiamos iniciativas locais que promovem a habitação digna e o crescimento econômico regional, acreditando que o mercado imobiliário é um pilar fundamental para o progresso social.'
            }
        ]
    }
};

export default function LegalPage() {
    const [topic, setTopic] = useState('privacidade');

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('termos')) setTopic('termos');
        else if (hash.includes('responsabilidade')) setTopic('responsabilidade');
        else setTopic('privacidade');
        window.scrollTo(0, 0);
    }, [window.location.hash]);

    const data = CONTENT[topic] || CONTENT['privacidade'];

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-40 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <div className="h-1 w-20 bg-brand-primary mb-8 rounded-full"></div>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white mb-6 tracking-tighter transition-colors">
                            {data.title}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Última atualização: Dezembro 2024
                        </p>
                    </div>

                    <div className="space-y-12">
                        {data.sections.map((section, i) => (
                            <div key={i} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                                <h3 className="text-xl font-black text-brand-dark dark:text-white mb-4 tracking-tight">
                                    {section.subtitle}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-10 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-white/5 transition-colors">
                        <h4 className="font-black text-brand-dark dark:text-white mb-4">Ainda tem dúvidas?</h4>
                        <p className="text-slate-500 mb-6 font-medium">Nossa equipe jurídica e de atendimento está à disposição para esclarecer qualquer ponto sobre nossa atuação.</p>
                        <a
                            href="https://wa.me/556436713590"
                            target="_blank"
                            className="inline-block bg-brand-dark dark:bg-brand-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                        >
                            Falar com Suporte
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
