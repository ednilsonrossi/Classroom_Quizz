import { Link } from "react-router-dom";
import { Pencil } from 'lucide-react';

export default function QuizHeader({ title, setTitle, onSave }) {
    return (
        <header className="w-full bg-white flex items-center justify-between px-4 md:px-8 py-3 md:py-0 h-16 md:h-20 shrink-0 shadow-sm z-10">

            <div className="flex items-center shrink-0">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <span className="text-slate-800 font-extrabold text-xl md:text-3xl tracking-tighter select-none transition-colors group-hover:text-black">
                        Classroom Quizz
                    </span>
                </Link>
            </div>

            <div className="hidden lg:flex flex-1 justify-center px-8">
                <div className="relative flex items-center w-full max-w-xl group">
                    <input
                        type="text"
                        placeholder="Dê um nome ao seu quiz..."
                        value={title}
                        maxLength={120}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-all shadow-inner text-base"
                    />
                    <Pencil className="absolute right-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">

                {/* Mobile */}
                <button
                    onClick={onSave}
                    className="lg:hidden bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-8 rounded-full text-sm transition-all active:scale-95 flex items-center shadow-sm"
                >
                    Salvar
                </button>

                {/* PC */}
                <button
                    onClick={onSave}
                    className="hidden lg:flex bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-8 rounded-lg transition-all active:scale-95 items-center gap-2 shadow-sm"
                >
                    Salvar e Sair
                </button>
            </div>

        </header>
    );
}