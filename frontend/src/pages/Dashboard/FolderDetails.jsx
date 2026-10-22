import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { folderService } from '../../services/folderService';
import QuizCard from '../../components/Dashboard/Library/QuizCard';
import AddQuizModal from '../../components/Dashboard/Library/AddQuizModal';
import { ArrowLeft, Plus, Folder, FileQuestion, ChevronRight } from 'lucide-react';
import { quizService } from '../../services/quizService';

export default function FolderDetails() {
    const { folderId } = useParams();
    const navigate = useNavigate();

    const [folderName, setFolderName] = useState('');
    const [folderDescription, setFolderDescription] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadFolderContents = async () => {
        try {
            setLoading(true);
            const data = await folderService.getFolderContents(folderId);
            setFolderName(data.folderName);
            setFolderDescription(data.folderDescription);
            setQuizzes(data.quizzes || []);
        } catch (err) {
            console.error('Erro ao carregar conteúdo da pasta:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (folderId) loadFolderContents();
    }, [folderId]);

    const handleQuizAdded = (movedQuiz) => {
        setQuizzes(prev => [...prev, movedQuiz]);
    };

    const handleRemoveFromFolder = async (quizId) => {
        try {
            await quizService.moveQuiz(quizId, null);
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (err) {
            console.error('Erro ao remover quiz da pasta:', err);
            alert('Não foi possível remover o quiz da pasta.');
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded-lg" />
                <div className="h-32 w-full bg-slate-100 rounded-2xl" />
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                    <div className="h-24 w-full bg-slate-50 rounded-xl" />
                    <div className="h-24 w-full bg-slate-50 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
            
            <nav className="flex items-center gap-2 text-sm font-medium">
                <button
                    onClick={() => navigate('/dashboard/library')}
                    className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                    Biblioteca
                </button>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 truncate max-w-50">{folderName}</span>
            </nav>

            <header className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">

                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <div className="flex items-start gap-5 relative z-10">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-50/25">
                        <Folder className="w-8 h-8" fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                                {folderName}
                            </h1>
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                                {quizzes.length} {quizzes.length === 1 ? 'item' : 'itens'}
                            </span>
                        </div>
                        {folderDescription ? (
                            <p className="text-slate-500 mt-2 max-w-xl leading-relaxed">
                                {folderDescription}
                            </p>
                        ) : (
                            <p className="text-slate-400 mt-1 text-sm italic">Sem descrição para esta pasta.</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative z-10 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 justify-center text-sm"
                >
                    <Plus className="w-5 h-5" /> Adicionar Quiz
                </button>
            </header>

            <main className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Quizzes na pasta</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {quizzes.map(quiz => (
                        <QuizCard 
                            key={quiz.id} 
                            quiz={quiz}
                            isInFolder={true}
                            onRemoveFromFolder={handleRemoveFromFolder}
                            onSuccess={(id) => setQuizzes(prev => prev.filter(q => q.id !== id))} 
                        />
                    ))}

                    {quizzes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl group transition-colors hover:bg-white hover:border-emerald-200">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                <FileQuestion className="w-8 h-8" />
                            </div>
                            <h3 className="text-slate-800 font-bold">Esta pasta está vazia</h3>
                            <p className="text-slate-500 text-sm mt-1 mb-6">Mova quizzes da sua biblioteca para organizar aqui.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm"
                            >
                                Vincular meu primeiro quiz
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <AddQuizModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                folderId={folderId}
                onQuizAdded={handleQuizAdded}
            />
        </div>
    );
}