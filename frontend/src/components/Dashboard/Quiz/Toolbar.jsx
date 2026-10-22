import { useRef, useState } from 'react';
import {
  Settings,
  Database,
  Image as ImageIcon,
  BookOpen,
  X,
  Trash2,
  Globe,
  Lock,
  Layout,
  Type,
  Clock,
  Target,
  ArrowDown
} from 'lucide-react';

export default function Toolbar({
  isOpen,
  onClose,
  question,
  updateQuestion,
  handleTypeQuestionChange,
  isEditingFeedback,
  setIsEditingFeedback,
  isPublic,
  setIsPublic,
  quizTitle,
  setQuizTitle,
  onOpenBank
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('question');

  if (!question) return null;

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      updateQuestion('image', e.target.files[0]);
    }
    e.target.value = '';
  };

  const questionImageSrc = question.image instanceof File
    ? URL.createObjectURL(question.image)
    : question.image;

  return (
    <div className={`fixed inset-y-0 right-0 z-90 w-full sm:w-96
    bg-white shadow-2xl flex flex-col h-full
    transform transition-transform duration-300
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    lg:relative lg:z-0 lg:w-80 lg:translate-x-0
    lg:border-l lg:border-slate-200 lg:shadow-none`}>

      {/* Header Mobile */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden bg-white">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-emerald-600" size={20} />
          Configurações
        </h2>
        <button
          onClick={onClose}
          aria-label="Fechar configurações"
          className="p-2 text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-xl mx-4 mt-4 shrink-0">
        <button
          onClick={() => setActiveTab('question')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'question'
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
        >
          <Settings size={16} />
          Questão
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'quiz'
            ? 'bg-white text-emerald-700 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
        >
          <Layout size={16} />
          Quiz
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-in fade-in duration-300">

            <section className="block lg:hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-500" /> Identificação
              </h3>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Título do Quiz
                </label>
                <input
                  type="text"
                  value={quizTitle || ''}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Ex: Prova de História"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                {isPublic
                  ? <Globe className="w-4 h-4 text-emerald-500" />
                  : <Lock className="w-4 h-4 text-amber-500" />
                }
                Privacidade
              </h3>

              <label className="flex items-start cursor-pointer group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublic ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-bold text-slate-700">
                    {isPublic ? 'Quiz Público' : 'Quiz Privado'}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {isPublic
                      ? 'Visível na comunidade. Qualquer pessoa pode ver e responder.'
                      : 'Restrito. Apenas você e pessoas com o link terão acesso.'}
                  </span>
                </div>
              </label>
            </section>
          </div>
        )}

        {activeTab === 'question' && (
          <div className="space-y-8 animate-in fade-in duration-300">

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" /> Banco de Questões
              </h3>
              <button
              onClick={onOpenBank}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition-all shadow-md hover:shadow-lg">
                <ArrowDown size={16} /> Importar do Banco
              </button>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" /> Formato da Questão
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Tipo de Resposta
                  </label>
                  <select
                    value={question.typeQuestion}
                    onChange={(e) => handleTypeQuestionChange(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                  >
                    <option value="multipla_escolha">Múltipla Escolha</option>
                    <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Tempo (seg)
                    </label>
                    <input
                      type="number"
                      min={5}
                      value={question.time}
                      onChange={(e) => updateQuestion('time', parseInt(e.target.value, 10))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-500" /> Pontos
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={question.point}
                      onChange={(e) => updateQuestion('point', parseInt(e.target.value, 10))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" /> Detalhes
              </h3>
              <div className="relative">
                <textarea
                  maxLength={1000} 
                  value={question.description || ''}
                  onChange={(e) => updateQuestion('description', e.target.value)}
                  placeholder="Adicione um contexto extra..."
                  className="w-full p-3 pb-7 border border-slate-200 rounded-lg text-sm h-28 resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium bg-white px-1">
                  {question.description?.length || 0}/1000
                </div>
              </div>
              <button
                onClick={() => setIsEditingFeedback(!isEditingFeedback)}
                className={`mt-3 w-full p-2.5 rounded-lg text-sm font-semibold transition-all ${isEditingFeedback
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
              >
                {isEditingFeedback ? 'Concluir Justificativa' : 'Adicionar Correção/Explicação'}
              </button>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" /> Mídia de Apoio
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              {question.image ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 group shadow-sm">
                  <img
                    src={questionImageSrc}
                    alt="Imagem da questão"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => updateQuestion('image', null)}
                      aria-label="Remover imagem"
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                    >
                      <Trash2 size={16} /> Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-28 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <ImageIcon size={24} className="text-slate-400" />
                  <span>Fazer upload de imagem</span>
                </button>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
}