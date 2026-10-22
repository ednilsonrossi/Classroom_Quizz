export default function About() {
    return (
        <section id="sobre" className="relative bg-[#f8fafc] py-18 lg:py-18 overflow-hidden">
            <div className="mx-auto max-w-7xl px-10 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-emerald-500/20"></div>

                        <div className="rounded-2xl bg-emerald-900 p-8 shadow-2xl transform -rotate-2">
                            <h3 className="text-emerald-400 font-mono text-sm mb-4">// INICIAÇÃO CIENTÍFICA</h3>
                            <p className="text-white text-xl leading-relaxed font-medium">
                                Este projeto investiga o uso de jogos educacionais como estratégia para aumentar o engajamento e a participação dos estudantes no processo de aprendizagem.
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-px flex-1 bg-emerald-500/30"></div>
                                <span className="text-emerald-300 font-bold text-sm tracking-widest">IFSP ARARAQUARA</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col order-1 lg:order-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">
                            Nossa Origem
                        </h2>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Sobre o Classroom Quizz
                        </h3>

                        <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                            O Classroom Quizz é um projeto de Iniciação Científica desenvolvido no IFSP Araraquara, inspirado nos conceitos de Aprendizado Baseado em Jogos (GBL) e Sistemas de Resposta do Estudante (SRS).
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            A plataforma propõe um sistema de perguntas e respostas gamificado semelhante a ferramentas como o Kahoot!, porém com foco em software livre, extensibilidade e acompanhamento mais detalhado da aprendizagem dos estudantes.</p>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <span className="size-2 bg-emerald-500 rounded-full"></span>
                                    Open Source
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">Livre para usar, estudar e adaptar.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <span className="size-2 bg-emerald-500 rounded-full"></span>
                                    Gamificação
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">Aprendizado Baseado em Jogos</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}