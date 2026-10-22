import { BookOpen, Users, Star, Play, ChevronRight, Inbox, Search, GraduationCap, Rocket } from 'lucide-react';
import StatCard from './StatCard';

export default function StudentDashboard({ stats, recentQuizzes }) {
    const quizzes = recentQuizzes || [];

    return (
        <div className="space-y-8">

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white shadow-inner">
                        <Rocket size={30} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Pronto para decolar nos estudos?</h2>
                        <p className="text-slate-500 text-sm">Continue de onde parou ou descubra um novo desafio abaixo.</p>
                    </div>
                </div>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full transition-colors">
                    Minhas Conquistas
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Play className="text-emerald-600" />}
                    label="Quizzes Respondidos"
                    value={stats?.contentCount || 0}
                />
                <StatCard
                    icon={<Users className="text-blue-600" />}
                    label="Meus Grupos"
                    value={stats?.classCount || 0}
                />
                <StatCard
                    icon={<Star className="text-amber-500" />}
                    label="Quizzes Salvos"
                    value={stats?.quizCount || 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">Minha Atividade</h2>
                        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Ver histórico
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="p-4 hover:bg-emerald-50/50 transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <GraduationCap size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                                                {quiz.title}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Finalizado em {quiz.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <Inbox size={40} className="mb-3 opacity-20 text-emerald-900" />
                                <p className="text-sm italic">Você ainda não realizou nenhum quiz.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 text-white">
                                <Search size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Novos Desafios</h3>
                            <p className="text-emerald-50 text-sm leading-relaxed opacity-90">
                                Explore a biblioteca e encontre novos quizzes para praticar seus conhecimentos.
                            </p>
                        </div>
                        <button className="mt-8 w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center gap-2">
                            Explorar Conteúdo
                        </button>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <p className="text-xs text-emerald-800 leading-tight">
                            <strong>Dica do Sistema:</strong> Complete quizzes diariamente para subir no ranking da sua turma!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}