import { useState } from 'react';
import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function Step3({ onNext, onBack, data }) {
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        if (!values.birthday) {
            setError("Por favor, selecione sua data de nascimento.");
            return;
        }

        const dataNascimento = new Date(values.birthday);
        const today = new Date();

        if (dataNascimento > today) {
            setError("A data de nascimento não pode ser no futuro.");
            return;
        }
        if (dataNascimento.getFullYear() < 1900) {
            setError('Data de nascimento inválida. Use uma data após 1900.');
            return;
        }

        let age = today.getFullYear() - dataNascimento.getFullYear();
        let month_difference = today.getMonth() - dataNascimento.getMonth();

        if (month_difference < 0 || (month_difference === 0 && today.getDate() < dataNascimento.getDate())) {
            age--;
        }
        if (age < 12) {
            setError('Você deve ter pelo menos 12 anos para se cadastrar.');
            return;
        }

        onNext(values);
    };

    return (
        <AuthFormWrapper
            title="Quando você nasceu?"
            subtitle="Precisamos disso para personalizar sua experiência."
            buttonLabel="Continuar"
            currentStep={3}
            totalSteps={4}
            onSubmit={handleSubmit}
            onBack={onBack}
        >
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <CalendarIcon className="h-5 w-5" />
                </div>

                <input
                    name="birthday"
                    type="date"
                    defaultValue={data.birthday}
                    required
                    className={`w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all appearance-none
                        ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                />
                {error && (
                    <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {error}
                    </p>
                )}
            </div>

            <p className="text-center text-slate-400 text-[10px] uppercase tracking-widest mt-6">
                Sua idade não será exibida publicamente
            </p>
        </AuthFormWrapper>
    );
}