import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SobrePage() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="pt-40 pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <p className="text-brand-primary font-black text-xs uppercase tracking-[0.3em] mb-4">Nossa Essência</p>
                            <h2 className="text-5xl font-black text-brand-dark dark:text-white mb-8 tracking-tighter leading-tight font-serif italic">
                                Adão Silva Imóveis
                            </h2>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                <p>
                                    Somos uma empresa focada no bem estar das pessoas. Quando o assunto é imóvel, nós nos destacamos pela referência e credibilidade conquistada ao longo de <span className="text-brand-primary font-black">21 anos de mercado</span>.
                                </p>
                                <p>
                                    Com uma estrutura ampla e moderna e uma equipe totalmente especializada, oferecemos os melhores serviços do segmento imobiliário, desta forma podemos garantir e conquistar cada vez mais a excelência dos serviços prestados.
                                </p>
                                <p className="italic text-slate-400 border-l-4 border-brand-primary dark:border-brand-primary pl-6 py-2 bg-white/50 dark:bg-slate-900/50 rounded-r-xl shadow-sm">
                                    "Esse é o nome dos bons negócios imobiliários"
                                </p>
                                <div className="pt-8 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 flex items-center justify-center text-brand-primary font-black text-xs">
                                        CRECI
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 mb-1">Registro Profissional</p>
                                        <p className="text-brand-dark dark:text-white font-bold text-xl">CRECI-J Nº 22.477</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History Timeline */}
                        <div className="relative p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5 transition-colors">
                            <div className="absolute left-14 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary via-gray-100 dark:via-white/5 to-transparent rounded-full"></div>

                            <div className="space-y-12">
                                {/* Year 1 */}
                                <div className="relative pl-12 group">
                                    <div className="absolute left-1 font-bold text-brand-primary bg-white dark:bg-slate-900 px-2 -ml-3 z-20 transition-colors">01</div>
                                    <div className="absolute left-1 w-6 h-6 bg-brand-primary rounded-full border-4 border-white dark:border-slate-900 shadow-lg z-10 transition-colors duration-500"></div>
                                    <div>
                                        <span className="text-2xl font-black text-brand-primary block mb-1">2003</span>
                                        <h4 className="font-black text-brand-dark dark:text-white uppercase text-xs tracking-widest mb-2">Fundação</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Início de uma trajetória focada em transparência e bem estar familiar em Goiás.</p>
                                    </div>
                                </div>

                                {/* Year 2 */}
                                <div className="relative pl-12 group">
                                    <div className="absolute left-1 font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 -ml-3 z-20 transition-colors">02</div>
                                    <div className="absolute left-1 w-6 h-6 bg-brand-dark dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 shadow-lg z-10 transition-all duration-500"></div>
                                    <div>
                                        <span className="text-2xl font-black text-slate-400 block mb-1">2012</span>
                                        <h4 className="font-black text-brand-dark dark:text-white uppercase text-xs tracking-widest mb-2">Expansão de Sede</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Mudança para uma estrutura moderna e tecnológica, ampliando o portfólio de imóveis prontos.</p>
                                    </div>
                                </div>

                                {/* Year 3 */}
                                <div className="relative pl-12 group">
                                    <div className="absolute left-1 font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 -ml-3 z-20 transition-colors">03</div>
                                    <div className="absolute left-1 w-6 h-6 bg-brand-dark dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 shadow-lg z-10 transition-all duration-500"></div>
                                    <div>
                                        <span className="text-2xl font-black text-slate-400 block mb-1">2020</span>
                                        <h4 className="font-black text-brand-dark dark:text-white uppercase text-xs tracking-widest mb-2">Liderança Digital</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Referência absoluta em curadoria digital e lançamentos de alto padrão nos melhores bairros.</p>
                                    </div>
                                </div>

                                {/* Year 4 */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 w-8 h-8 bg-brand-primary rounded-full border-4 border-white dark:border-slate-900 shadow-xl z-30 animate-pulse transition-all duration-500"></div>
                                    <div className="ml-2">
                                        <span className="text-2xl font-black text-brand-primary block mb-1">2024</span>
                                        <h4 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">21 Anos de História</h4>
                                        <p className="text-brand-dark dark:text-white text-sm font-black">Consolidação como a imobiliária que é sinônimo de bons negócios e credibilidade total.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
