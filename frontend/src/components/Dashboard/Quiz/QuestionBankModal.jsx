import { useState, useEffect } from 'react';
import { quizService } from '../../../services/quizService';
import { X, Search, Database, PlusCircle, Loader2, AlertCircle } from 'lucide-react';

export default function QuestionBankModal({ onClose, onImport }) {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const data = await quizService.getQuestionsBank();
                console.log(data);
                setQuestions(data.questions || []);
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar as questões no momento.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    //Filtro de pesquisa
    const filteredQuestions = questions.filter(q =>
        q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Formatador para o tipo de questão
    const formatType = (type) => {
        if (type === 'verdadeiro_falso') return 'Verdadeiro/Falso';
        return 'Múltipla Escolha';
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Database className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Biblioteca de Questões</h2>
                            <p className="text-sm text-slate-500">Importe questões prontas para o seu quiz</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por palavras no enunciado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/30">

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                            <p className="text-sm font-medium">Carregando questões...</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-red-500 bg-red-50 rounded-xl border border-red-100 p-6 text-center">
                            <AlertCircle className="w-8 h-8" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && filteredQuestions.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <Database className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm font-medium">Nenhuma questão encontrada.</p>
                        </div>
                    )}

                    {!isLoading && !error && filteredQuestions.length > 0 && (
                        <div className="space-y-3">
                            {filteredQuestions.map((q, index) => (
                                <div
                                    key={q.id || index}
                                    className="group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-slate-800 font-medium text-sm line-clamp-2 mb-2">
                                            {q.text}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                                                {formatType(q.typeQuestion)}
                                            </span>
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                                                {q.point} Pontos
                                            </span>
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                                                {q.time} Seg
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onImport(q)}
                                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        <PlusCircle size={18} />
                                        <span>Importar</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}