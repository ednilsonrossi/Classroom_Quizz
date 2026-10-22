import { useEffect, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function SidebarSlides({
    questions,
    activeQuestionId,
    setActiveQuestionId,
    addQuestion,
    removeQuestion,
}) {
    //Referência para a div que contém a lista de slides
    const scrollContainerRef = useRef(null);

    //Monitora o tamanho da lista de questões
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,    
                left: container.scrollWidth,  
                behavior: 'smooth',            
            });
        }
    }, [questions.length]);

    const getPreviewImage = (image) => {
        if (!image) return null;
        if (image instanceof File) return URL.createObjectURL(image);
        return image;
    };

    return (
        <aside className="w-full md:w-48 lg:w-56 bg-slate-100 border-t md:border-t-0 md:border-r border-slate-200 flex h-32 md:h-full shrink-0 z-20 shadow-inner">

            <div
                ref={scrollContainerRef}
                className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto p-3 md:p-4 gap-4 items-center md:items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >

                {questions.map((q, index) => {
                    const isActive = q.id === activeQuestionId;
                    const imgPreview = getPreviewImage(q.image);

                    return (
                        <div
                            key={q.id}
                            onClick={() => setActiveQuestionId(q.id)}
                            role="button"
                            aria-pressed={isActive}
                            className={`
                relative shrink-0 cursor-pointer w-28 md:w-full h-auto rounded-xl p-2 transition-all
                ${isActive
                                    ? 'bg-white shadow-md border-2 border-emerald-500'
                                    : 'bg-white shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow hover:bg-slate-50'
                                }
              `}
                        >
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-slate-600'}`}>
                                    {index + 1}
                                </span>

                                {questions.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeQuestion(q.id);
                                        }}
                                        aria-label="Excluir questão"
                                        className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded-md transition-colors"
                                    >
                                        <Trash2 size={12} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-md border border-slate-200/80 h-14 md:h-20 w-full flex flex-col overflow-hidden">
                                <div className="flex-1 w-full bg-white flex items-center justify-center p-1.5 overflow-hidden">
                                    {imgPreview ? (
                                        <img src={imgPreview} alt="Thumb" className="w-full h-full object-cover rounded-xs opacity-95" />
                                    ) : q.text ? (
                                        <span className="text-[9px] md:text-[11px] text-slate-500 leading-tight text-center font-medium line-clamp-2">
                                            {q.text}
                                        </span>
                                    ) : (
                                        <ImageIcon className="w-4 h-4 text-slate-300" />
                                    )}
                                </div>

                                <div className="h-2 md:h-2.5 w-full flex gap-px bg-slate-200 p-px">
                                    <div className="flex-1 bg-red-400 rounded-bl-sm" />
                                    <div className="flex-1 bg-blue-400" />
                                    <div className="flex-1 bg-yellow-400" />
                                    <div className="flex-1 bg-emerald-400 rounded-br-sm" />
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="shrink-0 flex items-center justify-center py-2 md:py-0.5 w-28 md:w-full">
                    <button
                        onClick={addQuestion}
                        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
                        aria-label="Adicionar Nova Questão"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </aside>
    );
}