import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizActionsMenu from './QuizActionsMenu';
import { Pencil, Eye, Play, User2, CalendarDays, BookOpen } from 'lucide-react';

export default function QuizCard({ quiz, isInFolder, onRemoveFromFolder, onSuccess }) {
    const navigate = useNavigate();

    const getAvatarColor = (char) => {
        const code = char.toUpperCase().charCodeAt(0) || 65;
        const colors = [
            { bg: 'bg-lime-50 text-green-700 border-green-100', hover: 'group-hover:bg-green-100' },
            { bg: 'bg-sky-50 text-sky-600 border-sky-100', hover: 'group-hover:bg-sky-100' },
            { bg: 'bg-yellow-50 text-amber-600 border-yellow-100', hover: 'group-hover:bg-yellow-100' },
        ];
        return colors[code % colors.length];
    };

    const firstLetter = quiz.title.charAt(0).toUpperCase();
    const avatarStyle = getAvatarColor(firstLetter);

    return (
        <div className="group bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-200 flex flex-row items-center justify-between gap-3">

            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">

                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shrink-0 border transition-colors duration-200 ${avatarStyle.bg} ${avatarStyle.hover}`}>
                    {firstLetter}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors duration-200">
                        {quiz.title}
                    </h3>

                    <div className="flex items-center flex-wrap gap-2.5 text-xs text-slate-500 mt-1.5 font-medium">

                        <div className="flex items-center gap-1.5" title="Autor do Quiz">
                            <User2 className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-30">{quiz.originalAuthor || 'Você'}</span>
                        </div>

                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>

                        <div className="flex items-center gap-1.5" title="Data de Criação">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            <span>{quiz.createdAt.split(' ')[0]}</span>
                        </div>

                        <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block"></span>

                        <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-100/80">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            <span>{quiz.questionsCount}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

                <button
                    onClick={() => navigate(`/quiz/view/${quiz.id}`)}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all duration-200"
                    title="Editar"
                >
                    <Eye className='w-4 h-4 md:w-4.5 md:h-4.5' />
                </button>

                <button
                    onClick={() => navigate(`/dashboard/quiz/edit/${quiz.id}`)}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all duration-200"
                    title="Editar"
                >
                    <Pencil className='w-4 h-4 md:w-4.5 md:h-4.5' />
                </button>


                <QuizActionsMenu
                    quizId={quiz.id}
                    isInFolder={isInFolder}
                    onRemoveFromFolder={onRemoveFromFolder}
                    onSuccess={onSuccess}
                />

                <button
                    onClick={() => navigate(`/dashboard/quiz/present/${quiz.id}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all shadow-xs active:scale-98 flex items-center gap-2 ml-1"
                >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Apresentar</span>
                </button>
            </div>
        </div>
    );
}