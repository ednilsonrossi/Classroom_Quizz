import React, { useState, useRef } from 'react';
import { EllipsisVertical, LogOut, Trash2, AlertTriangle, X } from 'lucide-react';
import { quizService } from '../../../services/quizService';

export default function QuizActionsMenu({ quizId, isInFolder, onRemoveFromFolder, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [menuPosition, setMenuPosition] = useState('bottom');

    const buttonRef = useRef(null);

    const handleToggleMenu = (e) => {
        e.stopPropagation();

        if (!isOpen) {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;

                setMenuPosition(spaceBelow < 130 ? 'top' : 'bottom');
            }
        }

        setIsOpen(!isOpen);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async (e) => {
        e.stopPropagation();
        try {
            setIsDeleting(true);
            await quizService.deleteQuiz(quizId);
            setIsConfirmOpen(false);
            if (onSuccess) onSuccess(quizId);
        } catch (error) {
            console.error('Erro ao excluir quiz:', error);
            alert('Não foi possível excluir o quiz.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggleMenu}
                className={`p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative z-20 ${isOpen ? 'bg-slate-100 text-slate-600 shadow-inner' : ''}`}
                title="Opções"
            >
                <EllipsisVertical className='w-4.5 h-4.5 md:w-5 md:h-5' />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                />
            )}

            {isOpen && (
                <div
                    className={`absolute right-0 w-48 sm:w-56 bg-white/95 backdrop-blur-sm border border-slate-100/80 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-1.5 z-30 transition-all duration-200 ease-out 
            ${menuPosition === 'top'
                            ? 'bottom-full mb-2 origin-bottom-right animate-slide-up'
                            : 'top-full mt-2 origin-top-right animate-scale-in'
                        }`}
                >
                    {isInFolder && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onRemoveFromFolder(quizId);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium"
                        >
                            <LogOut className="w-4 h-4 text-slate-400" />
                            Remover da pasta
                        </button>
                    )}

                    <button
                        onClick={handleDeleteClick}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors font-medium"
                    >
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                        Excluir permanentemente
                    </button>
                </div>
            )}

            {isConfirmOpen && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDeleting) setIsConfirmOpen(false);
                    }}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 transition-all"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-slide-up sm:animate-scale-in flex flex-col"
                    >
                        <div className="flex justify-end p-4 pb-0 sm:hidden">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 pt-2 sm:pt-6 text-center space-y-4">
                            <div className="w-14 h-14 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <AlertTriangle className="w-7 h-7" />
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Excluir este quiz?</h4>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed px-2">
                                    Esta ação <strong className="text-slate-700">não pode ser desfeita</strong>. O quiz será deletado permanentemente do sistema.
                                </p>
                            </div>
                        </div>

                        <footer className="p-5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                disabled={isDeleting}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirmOpen(false);
                                }}
                                className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 order-2 sm:order-1"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:bg-red-400 flex items-center justify-center gap-2 order-1 sm:order-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Excluindo...
                                    </>
                                ) : (
                                    'Sim, excluir'
                                )}
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}