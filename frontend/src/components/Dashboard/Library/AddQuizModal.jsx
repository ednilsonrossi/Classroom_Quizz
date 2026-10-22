import React, { useEffect, useState } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';
import { quizService } from '../../../services/quizService';

export default function AddQuizModal({ isOpen, onClose, folderId, onQuizAdded }) {
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [loadingAvailable, setLoadingAvailable] = useState(false);
    const [movingQuizId, setMovingQuizId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const fetchAvailableQuizzes = async () => {
                try {
                    setLoadingAvailable(true);
                    const data = await quizService.getLibrary();
                    setAvailableQuizzes(data.unorganizedQuizzes || []);
                } catch (error) {
                    console.error('Erro ao buscar quizzes disponíveis:', error);
                } finally {
                    setLoadingAvailable(false);
                }
            };
            fetchAvailableQuizzes();
        }
    }, [isOpen]);

    const handleAddQuizToFolder = async (quizId) => {
        try {
            setMovingQuizId(quizId);
            await quizService.moveQuiz(quizId, parseInt(folderId));

            const movedQuiz = availableQuizzes.find(q => q.id === quizId);
            if (movedQuiz) {
                onQuizAdded(movedQuiz);
                setAvailableQuizzes(prev => prev.filter(q => q.id !== quizId));
            }
        } catch (error) {
            alert('Erro ao mover o quiz para a pasta.');
            console.error(error);
        } finally {
            setMovingQuizId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 transition-all">

            <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-[75vh] animate-slide-up sm:animate-scale-in">

                <header className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 shrink-0">
                    <div>
                        <h3 className="font-bold text-slate-800 text-base tracking-tight">Adicionar à pasta</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Selecione um quiz avulso para organizar aqui</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200/60 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="p-4 overflow-y-auto flex-1 space-y-2.5 min-h-62.5 bg-white">
                    {loadingAvailable ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 font-medium">
                            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Buscando quizzes disponíveis...</span>
                        </div>
                    ) : availableQuizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
                            <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                                <FolderPlus className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium max-w-70">
                                Todos os seus quizzes já estão organizados em pastas!
                            </p>
                        </div>
                    ) : (
                        availableQuizzes.map(quiz => {
                            const isMovingThis = movingQuizId === quiz.id;
                            return (
                                <div
                                    key={quiz.id}
                                    className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all duration-200"
                                >
                                    <div className="min-w-0 pr-3">
                                        <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">
                                            {quiz.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                                            {quiz.questionsCount} {quiz.questionsCount === 1 ? 'questão' : 'questões'}
                                        </p>
                                    </div>

                                    <button
                                        disabled={movingQuizId !== null}
                                        onClick={() => handleAddQuizToFolder(quiz.id)}
                                        className={`p-2 rounded-xl transition-all flex items-center justify-center border shrink-0 font-semibold text-sm
                                            ${isMovingThis
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600 px-3'
                                                : 'bg-slate-50 border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-slate-600 disabled:opacity-40'
                                            }`}
                                    >
                                        {isMovingThis ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs font-bold">Movendo</span>
                                            </div>
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                <footer className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/70 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                    >
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
}