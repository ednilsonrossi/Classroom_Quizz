import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Info,
    Image as ImageIcon,
    X,
    ZoomIn,
} from "lucide-react";

import { quizService } from "../../services/quizService";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getImageUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") return null;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.replace(/^\/+/, "");
    const staticPath = normalizedPath.startsWith("static/")
        ? normalizedPath
        : `static/${normalizedPath}`;

    return `${API_BASE_URL}/${staticPath}`;
}

function getQuestionTextClass(text) {
    const length = text?.length ?? 0;
    if (length < 45) return "text-2xl sm:text-3xl lg:text-4xl font-extrabold";
    if (length < 100) return "text-xl sm:text-2xl lg:text-3xl font-bold";
    if (length < 180) return "text-lg sm:text-xl lg:text-2xl font-semibold";
    return "text-base sm:text-lg lg:text-xl font-medium";
}

function getAlternativeTextClass(text) {
    const length = text?.length ?? 0;
    if (length < 30) return "text-sm sm:text-base lg:text-lg font-semibold";
    if (length < 65) return "text-sm md:text-base font-semibold";
    return "text-xs sm:text-sm font-medium leading-snug";
}

const ALT_ACCENTS = [
    { badge: "bg-rose-500", ring: "ring-rose-400" },
    { badge: "bg-sky-500", ring: "ring-sky-400" },
    { badge: "bg-amber-500", ring: "ring-amber-400" },
    { badge: "bg-emerald-500", ring: "ring-emerald-400" },
    { badge: "bg-violet-500", ring: "ring-violet-400" },
];

function StatusPanel({ title, children }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
                <h2 className="mb-2 text-xl font-bold text-slate-800">{title}</h2>
                <div className="text-slate-500">{children}</div>
            </div>
        </div>
    );
}

export default function ViewQuiz() {
    const { quizId } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showCorrection, setShowCorrection] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [correctionImageError, setCorrectionImageError] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadQuiz() {
            setLoading(true);
            setError(false);
            setQuiz(null);
            setCurrentQuestionIndex(0);
            setShowCorrection(false);

            try {
                const data = await quizService.getQuiz(quizId);
                if (!cancelled) setQuiz(data);
            } catch (err) {
                console.error("Erro ao carregar o quiz:", err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (quizId) {
            loadQuiz();
        } else {
            setError(true);
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [quizId]);

    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        setShowCorrection(false);
        setImageError(false);
        setCorrectionImageError(false);
        setExpandedImage(null);
    }, [currentQuestionIndex, quizId]);

    // Permite fechar a visualização ampliada com Escape, como em um visualizador de imagens.
    useEffect(() => {
        if (!expandedImage) return undefined;

        function handleKeyDown(event) {
            if (event.key === "Escape") setExpandedImage(null);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [expandedImage]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-base font-medium tracking-wide text-slate-400 shadow-sm animate-pulse md:text-lg">
                    Carregando apresentação do quiz...
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <StatusPanel title="Não foi possível carregar o quiz">
                Verifique sua conexão e tente acessar o questionário novamente.
            </StatusPanel>
        );
    }

    if (questions.length === 0 || !currentQuestion) {
        return (
            <StatusPanel title="Nenhuma questão disponível">
                Este quiz ainda não possui questões para exibir.
            </StatusPanel>
        );
    }

    const alternatives = Array.isArray(currentQuestion.alternatives)
        ? currentQuestion.alternatives
        : [];
    const hasImage = Boolean(currentQuestion.image);
    const hasCorrectionImage = Boolean(currentQuestion.correction_img);
    const isTrueFalse = currentQuestion.typeQuestion === "verdadeiro_falso";
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    function goToNext() {
        if (!isLastQuestion) setCurrentQuestionIndex((previous) => previous + 1);
    }

    function goToPrevious() {
        if (!isFirstQuestion) setCurrentQuestionIndex((previous) => previous - 1);
    }

    function toggleCorrection() {
        setShowCorrection((previous) => !previous);
        setCorrectionImageError(false);
    }

    return (
        <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-slate-50 font-sans">
            <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 shadow-sm sm:h-16 sm:px-5 lg:px-8">
                <div className="min-w-0 flex-1">
                    <Link to="/dashboard/library" className="flex items-center gap-3 group">
                        <span className="text-slate-800 font-extrabold text-xl md:text-3xl tracking-tighter select-none transition-colors group-hover:text-black">
                            {quiz.title}
                        </span>
                    </Link>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                    <div className="hidden rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 md:block">
                        Questão {currentQuestionIndex + 1} de {questions.length}
                    </div>

                    <nav aria-label="Navegação entre questões" className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={goToPrevious}
                            disabled={isFirstQuestion}
                            aria-label="Questão anterior"
                            className={`rounded-lg p-1.5 transition-colors sm:p-2 ${isFirstQuestion ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-white hover:shadow-sm"}`}
                        >
                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <span className="min-w-10 px-1 text-center text-xs font-bold text-slate-500 md:hidden">
                            {currentQuestionIndex + 1}/{questions.length}
                        </span>
                        <button
                            type="button"
                            onClick={goToNext}
                            disabled={isLastQuestion}
                            aria-label="Próxima questão"
                            className={`rounded-lg p-1.5 transition-colors sm:p-2 ${isLastQuestion ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-white hover:shadow-sm"}`}
                        >
                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex min-h-0 flex-1 justify-center overflow-hidden p-2 sm:p-4 lg:p-6">
                <section className="relative flex min-h-0 w-full max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
                    <div className="absolute right-3 top-3 z-10 sm:right-5 sm:top-5">
                        <button
                            type="button"
                            onClick={toggleCorrection}
                            aria-pressed={showCorrection}
                            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-md transition-colors sm:px-4 sm:text-sm ${showCorrection ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700" : "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
                        >
                            <Info className="h-4 w-4 shrink-0" />
                            <span>{showCorrection ? "Voltar à questão" : "Ver correção"}</span>
                        </button>
                    </div>

                    {showCorrection ? (
                        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 pt-16 sm:gap-4 sm:p-5 sm:pt-20 lg:flex-row lg:gap-6 lg:p-8 lg:pt-20">
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                <h2 className="mb-3 shrink-0 border-b border-slate-100 pb-2 text-lg font-bold text-slate-700 sm:text-xl lg:text-2xl">
                                    Justificativa da resposta
                                </h2>
                                <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-base leading-relaxed text-slate-700 shadow-inner sm:p-5 sm:text-lg lg:p-6 lg:text-xl">
                                    {currentQuestion.correction || (
                                        <span className="italic text-slate-400">
                                            Nenhuma justificativa fornecida para esta questão.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {hasCorrectionImage && (
                                <div className="relative flex min-h-[180px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner lg:min-h-0">
                                    {correctionImageError ? (
                                        <div className="p-4 text-center text-sm text-slate-500">
                                            Não foi possível carregar a imagem da correção.
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setExpandedImage({
                                                src: getImageUrl(currentQuestion.correction_img),
                                                alt: "Imagem da correção",
                                            })}
                                            aria-label="Ampliar imagem da correção"
                                            className="group relative flex h-full w-full cursor-zoom-in items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                        >
                                            <img
                                                src={getImageUrl(currentQuestion.correction_img)}
                                                alt="Imagem da correção"
                                                onError={() => setCorrectionImageError(true)}
                                                className="block h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.01] sm:p-3"
                                            />
                                            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-semibold text-white opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                <ZoomIn className="h-4 w-4" /> Ampliar
                                            </span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 pt-16 sm:gap-4 sm:p-5 sm:pt-20 lg:gap-5 lg:p-8 lg:pt-20">
                            <div className={`grid min-h-0 flex-1 gap-3 sm:gap-4 ${hasImage ? "grid-rows-[minmax(5rem,0.8fr)_minmax(0,1.7fr)] lg:grid-rows-[minmax(6rem,0.8fr)_minmax(0,1.7fr)]" : "grid-rows-1"}`}>
                                <div className={`flex min-h-0 min-w-0 items-center justify-center overflow-hidden break-words rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-center text-slate-800 shadow-inner sm:p-5 lg:p-7 ${getQuestionTextClass(currentQuestion.text)}`}>
                                    <p className="w-full whitespace-pre-wrap">{currentQuestion.text}</p>
                                </div>

                                {hasImage && (
                                    <div className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                                        {imageError ? (
                                            <div className="flex flex-col items-center gap-2 p-4 text-center text-sm text-slate-500">
                                                <ImageIcon className="h-6 w-6" />
                                                Não foi possível carregar a imagem da questão.
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setExpandedImage({
                                                    src: getImageUrl(currentQuestion.image),
                                                    alt: "Imagem da questão",
                                                })}
                                                aria-label="Ampliar imagem da questão"
                                                className="group relative flex h-full w-full cursor-zoom-in items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                            >
                                                <img
                                                    src={getImageUrl(currentQuestion.image)}
                                                    alt="Imagem da questão"
                                                    onError={() => setImageError(true)}
                                                    className="block h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.01] sm:p-3"
                                                />
                                                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-semibold text-white opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                                                    <ZoomIn className="h-4 w-4" /> Ampliar
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:gap-4">
                                {alternatives.map((alternative, index) => {
                                    const accent = ALT_ACCENTS[index % ALT_ACCENTS.length];
                                    const displayedText = isTrueFalse
                                        ? (index === 0 ? "Verdadeiro" : "Falso")
                                        : (alternative.text ?? "");
                                    const isCorrect = Boolean(alternative.is_correct);

                                    return (
                                        <div
                                            key={alternative.id ?? index}
                                            className={`flex min-h-[3.5rem] min-w-0 items-center gap-3 rounded-xl border p-2.5 transition-colors sm:min-h-[4rem] sm:p-3 lg:min-h-[4.5rem] ${isCorrect ? `border-slate-300 bg-white shadow-sm ring-2 ${accent.ring} ring-offset-1` : "border-slate-200 bg-slate-50 opacity-80"}`}
                                        >
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black shadow-sm sm:h-9 sm:w-9 ${isCorrect ? `${accent.badge} text-white` : "bg-slate-300 text-white"}`}>
                                                {isCorrect ? (
                                                    <Check className="h-5 w-5" strokeWidth={3} />
                                                ) : (
                                                    isTrueFalse
                                                        ? (index === 0 ? "V" : "F")
                                                        : String.fromCharCode(65 + index)
                                                )}
                                            </div>
                                            <div className={`min-w-0 flex-1 break-words leading-snug text-slate-700 ${getAlternativeTextClass(displayedText)}`}>
                                                {displayedText}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {expandedImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={expandedImage.alt}
                    onClick={() => setExpandedImage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6"
                >
                    <button
                        type="button"
                        onClick={() => setExpandedImage(null)}
                        aria-label="Fechar imagem ampliada"
                        className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:top-5"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <img
                        src={expandedImage.src}
                        alt={expandedImage.alt}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[92dvh] max-w-[96vw] select-none object-contain shadow-2xl"
                    />

                    <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1.5 text-center text-xs text-white/80 sm:bottom-5">
                        Clique fora da imagem ou pressione Esc para fechar
                    </p>
                </div>
            )}
        </div>
    );
}
