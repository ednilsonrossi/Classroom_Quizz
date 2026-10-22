export default function Contact() {
    return (
        <section id="contato" className="bg-white py-18 lg:py-18">
            <div className="mx-auto max-w-7xl px-10 lg:px-24">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0b441c] sm:text-4xl">
                        Contato
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Estamos sempre procurando melhorar a sua experiência! Nos dê o seu feedback, sua opinião é fundamental para o projeto.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12 items-start">

                    <div className="lg:col-span-5 bg-emerald-900 p-8 rounded-2xl shadow-xl text-white">
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-emerald-400">
                            Como falar conosco
                        </h3>
                        <p className="text-emerald-100/80 mb-8">
                            Envie um comentário ou e-mail. Nossa equipe da Iniciação Científica está pronta para responder.
                        </p>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-emerald-500 tracking-widest">Nosso e-mail</span>
                                <a href="mailto:equipe.classroomquiz@gmail.com" className="text-lg hover:text-emerald-300 transition-colors break-all">
                                    equipe.classroomquiz@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="mt-12 opacity-20 flex justify-end">
                            <div className="grid grid-cols-3 gap-1">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="size-2 bg-emerald-400"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">

                            <div>
                                <label htmlFor="first-name" className="block text-sm font-bold text-gray-700 uppercase tracking-tight">Seu nome</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        required
                                        minLength={3}
                                        maxLength={50}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                        placeholder="Ex: João Silva"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-tight">Seu e-mail</label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        required
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 uppercase tracking-tight">Assunto</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        required
                                        minLength={5}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 uppercase tracking-tight">Mensagem</label>
                                <div className="mt-2">
                                    <textarea
                                        rows={4}
                                        required
                                        minLength={10}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                                        placeholder="Como podemos ajudar?"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-800 px-3.5 py-4 text-center text-sm font-bold text-white uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(16,185,129,0.5)] hover:bg-emerald-900 transition-all active:translate-y-1 active:shadow-none"
                                >
                                    Enviar Mensagem
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}