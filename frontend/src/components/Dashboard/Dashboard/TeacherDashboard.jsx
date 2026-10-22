import React from 'react';
import { BookOpen, Users, LayoutDashboard, Plus, ChevronRight, Inbox } from 'lucide-react';
import StatCard from './StatCard';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard({ stats, recentQuizzes }) {
    const navigate = useNavigate();
    const quizzes = recentQuizzes || [];

    return (
        <div className="space-y-8">
         
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<BookOpen className="text-emerald-600" />}
                    label="Conteúdos Criados"
                    value={stats?.contentCount || 0}
                />
                <StatCard
                    icon={<Users className="text-blue-600" />}
                    label="Turmas Ativas"
                    value={stats?.classCount || 0}
                />
                <StatCard
                    icon={<LayoutDashboard className="text-amber-600" />}
                    label="Questões Ativas"
                    value={stats?.questionActiveCount || 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">Quizzes Recentes</h2>
                        <button
                        onClick={() => navigate('/dashboard/library')} 
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Ver todos
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                                    onClick={() => console.log(`Abrir quiz ${quiz.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                                                {quiz.title}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Criado em {quiz.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            ))
                        ) : (
                            <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                                <Inbox size={40} className="mb-2 opacity-20" />
                                <p className="text-sm italic">Nenhum quiz criado ainda.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 flex flex-col justify-between h-full">

                        <div>
                            <h3 className="text-xl font-bold mb-2">Expanda seus conteúdos</h3>
                            <p className="text-emerald-50 text-sm leading-relaxed opacity-90">
                                Crie novos quizzes e engaje seus alunos com atividades personalizadas e trilhas de aprendizado.
                            </p>
                        </div>

                        <button 
                        onClick={() => navigate('/quiz/create')}
                        className="mt-8 w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Plus size={20} />
                            Criar Novo Quiz
                        </button>

                    </div>

                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
                        <p className="text-xs text-slate-500">
                            Precisa de ajuda para começar? <br />
                            <span className="text-emerald-600 font-medium cursor-pointer hover:underline">Veja nossos tutoriais</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}