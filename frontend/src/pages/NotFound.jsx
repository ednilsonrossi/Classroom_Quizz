import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import AppButton from "../components/Buttons/AppButton";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
       
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-200 blur-3xl opacity-20 rounded-full scale-150"></div>
          <div className="relative flex justify-center">
            <span className="text-9xl font-black text-slate-200">404</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <QuestionMarkCircleIcon className="h-24 w-24 text-emerald-500 animate-bounce" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
          Página não encontrada
        </h2>
        <p className="text-slate-600 mb-10 leading-relaxed">
          Parece que o link que você tentou acessar não existe ou foi movido. 
          Não se preocupe, acontece com os melhores exploradores!
        </p>

        <div className="flex flex-col gap-4">
          <AppButton href="/" variant="primary" className="flex items-center justify-center gap-2 rounded-full">
            <HomeIcon className="h-5 w-5" />
            Voltar para o Início
          </AppButton>
          
          <Link 
            to="/auth" 
            className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
          >
            Ir para a página de Login
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Código de erro: 404_NOT_FOUND
          </p>
        </div>
      </div>
    </main>
  );
}