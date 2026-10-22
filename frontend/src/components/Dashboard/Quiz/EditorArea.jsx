import { useRef, useEffect, useState } from 'react';
import { Image, Check, Plus, X } from 'lucide-react';

function useObjectUrl(file) {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!file) {
            setUrl(null);
            return;
        }
        if (!(file instanceof File)) {
            setUrl(file);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
}

const ALT_ACCENTS = [
    { badge: 'bg-rose-500', ring: 'ring-rose-400' },
    { badge: 'bg-sky-500', ring: 'ring-sky-400' },
    { badge: 'bg-amber-500', ring: 'ring-amber-400' },
    { badge: 'bg-emerald-500', ring: 'ring-emerald-400' },
    { badge: 'bg-violet-500', ring: 'ring-violet-400' },
];

const QUESTION_MAX_CHARS_WITH_IMAGE = 160;
const QUESTION_MAX_CHARS_WITHOUT_IMAGE = 360;
const ALT_MAX_CHARS = 90;

//Helpers de tipografia responsiva
function getQuestionTextClass(text) {
    const len = text?.length ?? 0;
    if (len < 30) return 'text-2xl md:text-4xl font-extrabold';
    if (len < 70) return 'text-xl md:text-3xl font-bold';
    if (len < 120) return 'text-lg md:text-2xl font-bold';
    if (len < 180) return 'text-base md:text-xl font-semibold';
    return 'text-sm md:text-lg font-medium';
}

function getAltTextClass(text) {
    const len = text?.length ?? 0;
    if (len < 20) return 'text-base md:text-lg font-semibold';
    if (len < 45) return 'text-sm md:text-base font-semibold';
    if (len < 80) return 'text-xs md:text-sm font-medium';
    return 'text-xs md:text-xs font-medium leading-tight';
}

export default function EditorArea({
    question,
    updateQuestion,
    updateAlternative,
    addAlternative,
    removeAlternative,
    isEditingFeedback,
}) {
    const correctionImgInputRef = useRef(null);
    const questionTextRef = useRef(null);

    const questionImageUrl = useObjectUrl(question?.image);
    const correctionImageUrl = useObjectUrl(question?.correction_img);

    const hasImage = !!questionImageUrl;
    const isVerdadeiroFalso = question?.typeQuestion === 'verdadeiro_falso';

    //Força o corte do texto assim que uma imagem é inserida
    useEffect(() => {
        if (hasImage && question?.text && question.text.length > QUESTION_MAX_CHARS_WITH_IMAGE) {
            updateQuestion('text', question.text.slice(0, QUESTION_MAX_CHARS_WITH_IMAGE));
        }
    }, [hasImage, question?.text, updateQuestion]);

    useEffect(() => {
        const textarea = questionTextRef.current;
        if (!textarea) return;

        if (hasImage) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        } else {
            textarea.style.height = '100%';
        }
    }, [question?.text, hasImage]);

    if (!question) {
        return (
            <main className="flex-1 bg-slate-50 flex items-center justify-center h-full">
                <p className="text-slate-400 font-medium text-lg tracking-wide bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
                    Selecione ou crie uma questão para editar.
                </p>
            </main>
        );
    }

    const questionMaxChars = hasImage
        ? QUESTION_MAX_CHARS_WITH_IMAGE
        : QUESTION_MAX_CHARS_WITHOUT_IMAGE;

    const handleAltCorrectClick = (alt) => {
        if (isVerdadeiroFalso && alt.is_correct) return;

        const switchingToActive = !alt.is_correct;

        if (switchingToActive) {
            question.alternatives.forEach((item) => {
                if (item.id !== alt.id && item.is_correct) {
                    updateAlternative(item.id, 'is_correct', false);
                }
            });
    
            updateAlternative(alt.id, 'is_correct', true);
        } else {
            updateAlternative(alt.id, 'is_correct', false);
        }
    };

    const handleCorrectionImageChange = (e) => {
        const file = e.target.files[0];
        if (file) updateQuestion('correction_img', file);
        e.target.value = '';
    };

    return (
        <main className="flex-1 h-full bg-slate-50 p-2 md:p-4 flex overflow-hidden items-center justify-center">
            <input
                ref={correctionImgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCorrectionImageChange}
            />

            <div className="w-full h-full max-w-5xl flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex flex-col flex-1 min-h-0 p-3 md:p-6 gap-3 md:gap-5">

                    {isEditingFeedback ? (
                        <div className="flex flex-col flex-1 min-h-0 gap-3 md:gap-4">
                            <div className="flex items-center justify-between shrink-0 mb-1">
                                <h2 className="text-lg md:text-xl font-bold text-slate-700 tracking-tight">
                                    Justificativa da Resposta
                                </h2>
                                <button
                                    onClick={() => correctionImgInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-sm font-semibold border border-emerald-200"
                                >
                                    <Image className="w-4 h-4" />
                                    {question.correction_img ? 'Trocar imagem' : 'Adicionar imagem'}
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                                <textarea
                                    value={question.correction || ''}
                                    onChange={(e) => updateQuestion('correction', e.target.value.slice(0, 400))}
                                    placeholder="Explique detalhadamente por que esta é a resposta correta..."
                                    className="flex-1 min-h-30 resize-none border border-slate-200 rounded-2xl p-4 md:p-6
                                             focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 outline-none
                                             text-base md:text-xl text-slate-700 bg-slate-50/50 shadow-inner
                                             overflow-y-auto wrap-break-word placeholder:text-slate-300
                                             [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"
                                />

                                {correctionImageUrl ? (
                                    <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 min-h-37.5 shadow-inner">
                                        <img
                                            src={correctionImageUrl}
                                            alt="Imagem de correção"
                                            className="max-h-full max-w-full object-contain p-2"
                                        />
                                        <button
                                            onClick={() => updateQuestion('correction_img', null)}
                                            className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white px-3 py-1.5 rounded-lg font-medium shadow-md hover:bg-red-600 text-sm transition-colors"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ) : (
                                    <div className="hidden md:flex flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Image className="w-8 h-8 opacity-50" />
                                            <p className="font-medium text-sm text-center px-4">
                                                Espaço reservado para imagem de apoio
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    ) : (
                        <div className="flex flex-col flex-1 min-h-0 gap-3 md:gap-5">

                            <div className="flex-1 min-h-0 flex flex-col gap-3">
                                <textarea
                                    ref={questionTextRef}
                                    value={question.text}
                                    onChange={(e) => updateQuestion('text', e.target.value.slice(0, questionMaxChars))}
                                    placeholder="Digite a pergunta aqui..."
                                    rows={hasImage ? 1 : undefined}
                                    className={`
                                        w-full text-center text-slate-800 
                                        border border-slate-200 bg-slate-50/50 rounded-2xl shadow-inner
                                        p-3 md:p-6 outline-none transition-all
                                        focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white
                                        resize-none overflow-hidden wrap-break-word leading-tight placeholder:text-slate-300
                                        ${!hasImage ? 'flex-1 min-h-30' : 'shrink-0 min-h-15 md:min-h-20'}
                                        ${getQuestionTextClass(question.text)}
                                    `}
                                />

                                {hasImage && (
                                    <div className="flex-1 min-h-0 overflow-hidden relative flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                                        <img
                                            src={questionImageUrl}
                                            alt="Imagem da questão"
                                            className="max-h-full max-w-full object-contain p-2 rounded-xl"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 pb-1">

                                {question.alternatives.map((alt, index) => {
                                    const accent = ALT_ACCENTS[index % ALT_ACCENTS.length];

                                    const exibeTextoV_F = index === 0 ? 'Verdadeiro' : 'Falso';
                                    const valorTextoExibido = isVerdadeiroFalso ? exibeTextoV_F : alt.text;

                                    return (
                                        <div
                                            key={alt.id}
                                            onClick={() => handleAltCorrectClick(alt)}
                                            className={`
                                                relative flex items-center p-2 md:p-3
                                                h-16 md:h-20 lg:h-24
                                                rounded-xl md:rounded-2xl border
                                                cursor-pointer select-none transition-all duration-200 group
                                                ${alt.is_correct
                                                    ? `bg-white border-slate-300 ring-2 shadow-md ${accent.ring} ring-offset-2`
                                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm hover:shadow'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-8 h-8 md:w-10 md:h-10 rounded-lg shrink-0 mr-3
                                                flex items-center justify-center font-black text-sm md:text-base shadow-sm
                                                transition-colors duration-200 ${accent.badge}
                                            `}>
                                                {alt.is_correct
                                                    ? <Check className="w-4 h-4 md:w-6 md:h-6 text-white" strokeWidth={3} />
                                                    : <span className="text-white">
                                                        {isVerdadeiroFalso
                                                            ? (index === 0 ? 'V' : 'F')
                                                            : String.fromCharCode(65 + index)
                                                        }
                                                    </span>
                                                }
                                            </div>

                                            <textarea
                                                value={valorTextoExibido}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    if (!isVerdadeiroFalso) {
                                                        updateAlternative(alt.id, 'text', e.target.value.slice(0, ALT_MAX_CHARS));
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder={isVerdadeiroFalso ? '' : `Resposta ${index + 1}`}
                                                readOnly={isVerdadeiroFalso}
                                                className={`
                                                    flex-1 h-full bg-transparent border-none py-1
                                                    text-slate-700 placeholder:text-slate-300
                                                    focus:ring-0 outline-none resize-none
                                                    overflow-y-auto wrap-break-word leading-snug
                                                    ${isVerdadeiroFalso ? 'cursor-pointer select-none' : ''}
                                                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                                                    ${getAltTextClass(valorTextoExibido)}
                                                `}
                                            />

                                            {!isVerdadeiroFalso && question.alternatives.length > 2 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeAlternative(alt.id); }}
                                                    aria-label="Remover alternativa"
                                                    className="absolute -top-2 -right-2 bg-slate-300 hover:bg-red-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center border-2 border-white shadow-md md:opacity-0 group-hover:opacity-100 transition-all z-10"
                                                >
                                                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                {!isVerdadeiroFalso && question.alternatives.length < 5 && (
                                    <button
                                        onClick={addAlternative}
                                        className="h-16 md:h-20 lg:h-24 flex flex-row sm:flex-col items-center justify-center gap-2
                                               border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl
                                               bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600
                                               transition-all text-slate-400 font-semibold shadow-inner"
                                    >
                                        <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                                        <span className="text-sm md:text-base">Adicionar opção</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}