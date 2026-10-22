import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { folderService } from '../../services/folderService';
import QuizCard from '../../components/Dashboard/Library/QuizCard';
import {
    PlusIcon,
    FolderPlus,
    Search,
    X,
} from 'lucide-react';

export default function Library() {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderDesc, setNewFolderDesc] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [modalError, setModalError] = useState('');

    useEffect(() => {
        const getLibrary = async () => {
            try {
                setLoading(true);
                const data = await quizService.getLibrary();
                setFolders(data.folders || []);
                setQuizzes(data.unorganizedQuizzes || []);
            } catch (error) {
                console.error('Erro ao buscar biblioteca:', error);
            } finally {
                setLoading(false);
            }
        };

        getLibrary();
    }, []);

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.originalAuthor?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalError('');
        setNewFolderName('');
        setNewFolderDesc('');
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        const folderNameTrimmed = newFolderName.trim();
        if (!folderNameTrimmed) return;

        try {
            setIsSaving(true);
            setModalError('');

            const response = await folderService.createFolder({
                name: folderNameTrimmed,
                description: newFolderDesc
            });

            const newFolderObj = {
                id: response.id,
                name: folderNameTrimmed,
                quizzesCount: 0
            };

            setFolders((prev) => [...prev, newFolderObj]);
            handleCloseModal();
        } catch (error) {
            setModalError(error.message || 'Erro ao criar pasta. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] p-4 text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    Carregando seus conteúdos...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-10 animate-fade-in">

            <header className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4">

                <div className="relative w-full sm:w-80 md:w-96">
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                    <input
                        type="text"
                        placeholder="Pesquisar seus conteúdos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all"
                    />
                </div>

                <button
                    onClick={() => navigate('/quiz/create')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-emerald-600/10 transition-all flex items-center gap-2 justify-center"
                >
                    <PlusIcon className='w-5 h-5' />
                    Criar um Quiz
                </button>

            </header>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Pastas</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors group"
                    >
                        <PlusIcon className='w-4 h-4 transition-transform group-hover:scale-110' />
                        Nova Pasta
                    </button>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 md:gap-4">
                    {filteredFolders.length > 0 ? (
                        filteredFolders.map(folder => (
                            <div
                                key={folder.id}
                                onClick={() => navigate(`/dashboard/library/folder/${folder.id}`)}
                                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2.5"
                            >
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                                <div className="w-full">
                                    <h3 className="text-sm font-bold text-slate-700 line-clamp-1 group-hover:text-emerald-700 transition-colors">{folder.name}</h3>
                                    <span className="text-xs text-slate-400 font-medium">{folder.quizzesCount} {folder.quizzesCount === 1 ? 'item' : 'itens'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4">
                            <p className="text-slate-400 text-sm font-medium">
                                Nenhuma pasta encontrada.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Quizzes Avulsos</h2>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map(quiz => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                isInFolder={false}
                                onSuccess={(id) => setQuizzes(prev => prev.filter(q => q.id !== id))}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4">
                            <p className="text-slate-400 text-sm md:text-base font-medium">
                                Nenhum conteúdo encontrado.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 transition-all">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] sm:max-h-none animate-slide-up sm:animate-scale-in">

                        <header className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                            <div className="flex items-center gap-2">
                                <FolderPlus className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-slate-800 text-base md:text-lg">Criar nova pasta</h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        <form onSubmit={handleCreateFolder} className="overflow-y-auto flex-1">
                            <div className="p-5 space-y-4">
                                <div>
                                    <label htmlFor="folderName" className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">
                                        Nome da Pasta *
                                    </label>
                                    <input
                                        type="text"
                                        id="folderName"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="Ex: Geografia, Provas 2026..."
                                        maxLength={30}
                                        required
                                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="folderDesc" className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">
                                        Descrição <span className="text-xs text-slate-400 font-normal">(Opcional)</span>
                                    </label>
                                    <textarea
                                        id="folderDesc"
                                        value={newFolderDesc}
                                        onChange={(e) => setNewFolderDesc(e.target.value)}
                                        placeholder="Para que serve esta pasta? Ex: Conteúdo do primeiro bimestre..."
                                        maxLength={150}
                                        rows={3}
                                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {modalError && (
                                    <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 font-semibold animate-shake">
                                        {modalError}
                                    </p>
                                )}
                            </div>

                            <footer className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/70">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || !newFolderName.trim()}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                                >
                                    {isSaving ? 'Criando...' : 'Criar Pasta'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}