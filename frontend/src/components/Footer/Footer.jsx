import { Github , ExternalLink, Mail, MapPin, Phone, User } from 'lucide-react';
import cogumelo from '../../assets/icons/cogumelo.png';

export default function Footer() {
    return (
        <footer className="bg-emerald-900 text-white pt-18 pb-10 border-t border-emerald-900">
            <div className="mx-auto max-w-7xl px-10 lg:px-24">

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={cogumelo} alt="Logo" className="h-8 w-auto [image-rendering:pixelated]" />
                            <h5 className="text-2xl font-bold tracking-tight uppercase">
                                Sobre o <span className="text-emerald-400">Sistema</span>
                            </h5>
                        </div>
                        <p className="text-emerald-100/70 leading-relaxed mb-6">
                            O Classroom Quiz é um sistema gamificado de perguntas e respostas, desenvolvido como Iniciação Científica no IFSP Araraquara. É <span className="text-emerald-400 font-bold">Software Livre</span>, permitindo que você acesse o código-fonte e contribua com melhorias a partir da plataforma GitHub.
                        </p>

                        <div className="space-y-3">
                            <p className="text-emerald-100/70 leading-relaxed mb-6">
                                Desenvolvido por 
                                <span className="text-emerald-400 font-bold"> Samuel Fernandes Filho </span> 
                                sob orientação de 
                                <span className="text-emerald-400 font-bold"> Ednilson Rossi</span> e 
                                <span className="text-emerald-400 font-bold"> Janaína Abib</span>.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://github.com/ednilsonrossi/Classroom_Quizz" target="_blank" className="flex items-center gap-2 bg-white text-[#0b441c] px-4 py-2 rounded-md font-bold text-xs uppercase hover:bg-emerald-100 transition-all shadow-[3px_3px_0px_0px_rgba(16,185,129,0.5)] active:translate-y-1 active:shadow-none">
                                    <Github size={16} /> GitHub
                                </a>
                                <a href="https://linktr.ee/samuel_fernandesf" target="_blank" className="flex items-center gap-2 border border-emerald-500/30 px-2 py-2 rounded-md font-bold text-xs uppercase hover:bg-emerald-500/10 transition-all">
                                    Samuel
                                </a>
                                <a href="#" target="_blank" className="flex items-center gap-2 border border-emerald-500/30 px-2 py-2 rounded-md font-bold text-xs uppercase hover:bg-emerald-500/10 transition-all">
                                    Ednilson
                                </a>
                                <a href="#" target="_blank" className="flex items-center gap-2 border border-emerald-500/30 px-2 py-2 rounded-md font-bold text-xs uppercase hover:bg-emerald-500/10 transition-all">
                                    Janaína
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h5 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">
                            Navegação
                        </h5>
                        <ul className="space-y-4">
                            {['Início', 'Destaques', 'Sobre', 'Contato'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-emerald-100/60 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-0 bg-emerald-400 transition-all group-hover:w-3"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="https://labtecifsp.wordpress.com" target="_blank" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 font-bold italic">
                                    <ExternalLink size={14} /> LabTec IFSP
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h5 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">
                            Entre em Contato
                        </h5>
                        <div className="space-y-6 text-sm text-emerald-100/70">
                            <div className="flex items-start gap-4">
                                <Mail className="text-emerald-400 shrink-0" size={20} />
                                <a href="mailto:samuelfernandesfilho2007@gmail.com" className="hover:text-white transition-colors">
                                    samuelfernandesfilho2007@gmail.com
                                </a>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-emerald-400 shrink-0" size={20} />
                                <p>Rua Dr. Aldo Benedito Pierri, 250 - Jd. Paulo Freire, Araraquara - SP</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-emerald-400 shrink-0" size={20} />
                                <p>(16) 3303-2330</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-emerald-100/40 text-center md:text-left">
                    <p>© 2025 CLASSROOM QUIZ - TODOS OS DIREITOS RESERVADOS</p>
                    <div className="flex items-center gap-4">
                        <span className="uppercase tracking-widest">Iniciação Científica - IFSP</span>
                        <span className="h-4 w-px bg-emerald-800 hidden md:block"></span>
                        <span className="uppercase tracking-widest text-emerald-500/80">Software Livre</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}