import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from '../../services/quizService';
import { v4 as uuidv4 } from 'uuid';
import { Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import SidebarSlides from "../../components/Dashboard/Quiz/SidebarSlides";
import EditorArea from "../../components/Dashboard/Quiz/EditorArea";
import Toolbar from "../../components/Dashboard/Quiz/Toolbar";
import QuizHeader from "../../components/Dashboard/Quiz/QuizHeader";
import QuestionBankModal from "../../components/Dashboard/Quiz/QuestionBankModal";

const createEmptyQuestion = () => ({
    id: uuidv4(),
    image: null,
    text: '',
    typeQuestion: 'multipla_escolha',
    point: 10,
    time: 60,
    order: 0,
    description: '',
    correction: '',
    correction_img: null,
    alternatives: [
        { id: uuidv4(), text: '', is_correct: false },
        { id: uuidv4(), text: '', is_correct: false },
    ],
});

export default function CreateQuiz() {
    const navigate = useNavigate();

    //States do Quiz
    const [title, setTitle] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [folderId, setFolderId] = useState('');
    const [questions, setQuestions] = useState([createEmptyQuestion()]);

    //States da UI
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [isEditingFeedback, setIsEditingFeedback] = useState(false);
    const [isToolbarOpen, setIsToolbarOpen] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

    //Notificações
    const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
    const toastTimerRef = useRef(null);

    const showToast = (message, type = 'error') => {
        setToast({ visible: true, message, type });
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setToast({ visible: false, message: '', type: 'error' });
        }, 4000);
    };

    useEffect(() => {
        if (questions.length > 0) {
            setActiveQuestionId(questions[0].id);
        }
    }, []);

    const currentQuestion = questions.find(q => q.id === activeQuestionId) ?? null;

    //Questões
    const addQuestion = () => {
        const newQuestion = createEmptyQuestion();
        setQuestions(prev => [...prev, newQuestion]);
        setActiveQuestionId(newQuestion.id);
        setIsEditingFeedback(false);
    };

    const removeQuestion = (questionId) => {
        if (questions.length <= 1) {
            showToast('O quiz deve ter pelo menos uma questão.', 'error');
            return;
        }

        const currentIndex = questions.findIndex(q => q.id === questionId);
        const nextActive = questions[currentIndex + 1] ?? questions[currentIndex - 1];

        setQuestions(prev => prev.filter(q => q.id !== questionId));

        if (activeQuestionId === questionId) {
            setActiveQuestionId(nextActive.id);
        }
    };

    const updateQuestion = (field, value) => {
        setQuestions(prev =>
            prev.map(q => q.id === activeQuestionId ? { ...q, [field]: value } : q)
        );
    };

    const handleTypeQuestionChange = (newType) => {
        setQuestions(prev => prev.map(q => {
            if (q.id !== activeQuestionId) return q;

            const newAlternatives = newType === 'verdadeiro_falso'
                ? q.alternatives.slice(0, 2)
                : q.alternatives;

            return { ...q, typeQuestion: newType, alternatives: newAlternatives };
        }));
    };

    //Alternativas
    const addAlternative = () => {
        setQuestions(prev => prev.map(q => {
            if (q.id !== activeQuestionId) return q;
            return {
                ...q,
                alternatives: [
                    ...q.alternatives,
                    { id: uuidv4(), text: '', is_correct: false },
                ],
            };
        }));
    };

    const updateAlternative = (altId, field, value) => {
        setQuestions(prev => prev.map(q => {
            if (q.id !== activeQuestionId) return q;

            const updatedAlternatives = q.alternatives.map(alt => {
                if (field === 'is_correct') {
                    return { ...alt, is_correct: alt.id === altId ? value : false };
                }
                return alt.id === altId ? { ...alt, [field]: value } : alt;
            });

            return { ...q, alternatives: updatedAlternatives };
        }));
    };

    const removeAlternative = (altId) => {
        if (!currentQuestion || currentQuestion.alternatives.length <= 2) {
            showToast('Cada questão deve ter pelo menos 2 alternativas.', 'error');
            return;
        }

        setQuestions(prev => prev.map(q => {
            if (q.id !== activeQuestionId) return q;
            return { ...q, alternatives: q.alternatives.filter(alt => alt.id !== altId) };
        }));
    };

    //Banco de Questões
    const handleImportQuestion = (importedQuestion) => {
        setQuestions(prev => prev.map(q => {
            //Verifica se é a aba da questão que está aberta na tela agora
            if (q.id === activeQuestionId) {
                return {
                    ...q, //Mantém o ID original do frontend

                    text: importedQuestion.text || '',
                    description: importedQuestion.description || '',
                    typeQuestion: importedQuestion.typeQuestion || 'Múltipla Escolha',
                    point: importedQuestion.point || 10,
                    time: importedQuestion.time || 60,

                    alternatives: (importedQuestion.alternatives || []).map(alt => ({
                        id: uuidv4(), //Gera um ID novo do frontend para a alternativa
                        text: alt.text || '',
                        is_correct: alt.is_correct || false
                    }))
                };
            }
            return q;
        }));

        // Fecha o modal após a importação
        setIsQuestionBankModalOpen(false);
        showToast('Questão importada com sucesso!', 'success');
    };

    //Salvar
    const handleSave = async () => {
        if (!title.trim()) {
            showToast('Dê um título ao seu quiz antes de salvar.', 'error');
            return;
        }

        const questionsToValidate = questions.map(q => {
            if (q.typeQuestion === 'verdadeiro_falso') {
                return {
                    ...q,
                    alternatives: [
                        { id: q.alternatives[0]?.id, text: 'Verdadeiro', is_correct: q.alternatives[0]?.is_correct || false },
                        { id: q.alternatives[1]?.id, text: 'Falso', is_correct: q.alternatives[1]?.is_correct || false }
                    ]
                };
            }
            return q;
        });

        for (let i = 0; i < questionsToValidate.length; i++) {
            const q = questionsToValidate[i];
            if (!q.text.trim()) {
                setActiveQuestionId(q.id);
                showToast(`A Questão ${i + 1} precisa de um enunciado.`, 'error');
                return;
            }

            if (q.typeQuestion !== 'verdadeiro_falso') {
                const hasEmptyAlt = q.alternatives.some(alt => !alt.text.trim());
                if (hasEmptyAlt) {
                    setActiveQuestionId(q.id);
                    showToast(`Preencha o texto em todas as alternativas da Questão ${i + 1}.`, 'error');
                    return;
                }
            }

            const hasCorrect = q.alternatives.some(alt => alt.is_correct);
            if (!hasCorrect) {
                setActiveQuestionId(q.id);
                showToast(`Marque a alternativa correta na Questão ${i + 1}.`, 'error');
                return;
            }
        }

        setIsSaving(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('public', isPublic);
        if (folderId) formData.append('folder', folderId);

        const questionsTreated = questions.map((q, qIndex) => {
            let imageField = null;
            let correctionImageField = null;

            if (q.image instanceof File) {
                imageField = `img_question_${qIndex}`;
                formData.append(imageField, q.image);
            }

            if (q.correction_img instanceof File) {
                correctionImageField = `img_correction_${qIndex}`;
                formData.append(correctionImageField, q.correction_img);
            }

            const finalAlternatives = q.typeQuestion === 'verdadeiro_falso'
                ? [
                    { id: q.alternatives[0]?.id, text: 'Verdadeiro', is_correct: q.alternatives[0]?.is_correct },
                    { id: q.alternatives[1]?.id, text: 'Falso', is_correct: q.alternatives[1]?.is_correct }
                ]
                : q.alternatives.map(alt => ({ id: alt.id, text: alt.text, is_correct: alt.is_correct }));

            return {
                ...q,
                order: qIndex + 1,
                image: imageField,
                correction_img: correctionImageField,
                alternatives: finalAlternatives,
            };
        });

        formData.append('questions', JSON.stringify(questionsTreated));
        console.log(Object.fromEntries(formData.entries()));

        try {
            const response = await quizService.createQuiz(formData);
            if (response) {
                showToast('Quiz salvo com sucesso!', 'success');
                setTimeout(() => navigate('/dashboard/library'), 1500);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Erro inesperado ao salvar o quiz.";
            showToast(errorMessage, 'error');
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-100 overflow-hidden relative">

            <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-100 transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl font-medium text-sm ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {toast.message}
                </div>
            </div>

            <QuizHeader
                title={title}
                setTitle={setTitle}
                onSave={handleSave}
            />

            <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden min-h-0 relative">

                <SidebarSlides
                    questions={questions}
                    activeQuestionId={activeQuestionId}
                    setActiveQuestionId={setActiveQuestionId}
                    addQuestion={addQuestion}
                    removeQuestion={removeQuestion}
                />

                <div className={`flex-1 flex flex-col overflow-hidden transition-opacity ${isSaving ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <EditorArea
                        question={currentQuestion}
                        updateQuestion={updateQuestion}
                        updateAlternative={updateAlternative}
                        addAlternative={addAlternative}
                        removeAlternative={removeAlternative}
                        isEditingFeedback={isEditingFeedback}
                    />
                </div>

                {!isToolbarOpen && (
                    <button
                        onClick={() => setIsToolbarOpen(true)}
                        className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-l-xl shadow-[-4px_0_15px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center justify-center"
                    >
                        <Settings size={22} />
                    </button>
                )}

                <Toolbar
                    isOpen={isToolbarOpen}
                    onClose={() => setIsToolbarOpen(false)}
                    question={currentQuestion}
                    updateQuestion={updateQuestion}
                    handleTypeQuestionChange={handleTypeQuestionChange}
                    isEditingFeedback={isEditingFeedback}
                    setIsEditingFeedback={setIsEditingFeedback}
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                    quizTitle={title}
                    setQuizTitle={setTitle}
                    onOpenBank={() => setIsQuestionBankModalOpen(true)}
                />

                {isQuestionBankModalOpen && (
                    <QuestionBankModal
                        onClose={() => setIsQuestionBankModalOpen(false)}
                        onImport={handleImportQuestion}
                    />
                )}
            </div>
        </div>
    );
}