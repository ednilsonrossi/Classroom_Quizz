import { useState } from 'react';
import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper';
import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Step2({ onNext, onBack, data }) {
    const [selected, setSelected] = useState(data.account_type || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selected) {
            setError("Por favor, selecione como deseja participar.");
            return;
        }

        onNext({ account_type: selected });
    };

    return (
        <AuthFormWrapper
            title="O que eu sou?"
            subtitle='Escolha como deseja participar'
            buttonLabel="Continuar"
            currentStep={2}
            totalSteps={4}
            onSubmit={handleSubmit}
            onBack={onBack}
        >

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                <label className="relative cursor-pointer">
                    <input
                        type="radio"
                        name="account_type"
                        value="aluno"
                        className="peer sr-only"
                        checked={selected === 'aluno'}
                        onChange={() => setSelected('aluno')}
                    />
                    <div className="flex flex-col items-center p-6 bg-white border-2 rounded-2xl transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-slate-50 border-slate-200">
                        <div className={`p-4 rounded-full mb-3 transition-colors ${selected === 'aluno' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <AcademicCapIcon className="h-8 w-8" />
                        </div>
                        <h3 className={`font-bold transition-colors ${selected === 'aluno' ? 'text-emerald-700' : 'text-slate-600'}`}>
                            Aluno
                        </h3>
                    </div>
                </label>

                <label className="relative cursor-pointer">
                    <input
                        type="radio"
                        name="account_type"
                        value="professor"
                        className="peer sr-only"
                        checked={selected === 'professor'}
                        onChange={() => setSelected('professor')}
                    />
                    <div className="flex flex-col items-center p-6 bg-white border-2 rounded-2xl transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-slate-50 border-slate-200">
                        <div className={`p-4 rounded-full mb-3 transition-colors ${selected === 'professor' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <UserIcon className="h-8 w-8" />
                        </div>
                        <h3 className={`font-bold transition-colors ${selected === 'professor' ? 'text-emerald-700' : 'text-slate-600'}`}>
                            Professor
                        </h3>
                    </div>
                </label>

            </div>
        </AuthFormWrapper>
    );
}