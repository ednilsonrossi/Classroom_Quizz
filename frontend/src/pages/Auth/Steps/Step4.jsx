import { useState } from 'react';
import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper';
import { authService } from '../../../services/authService';
import { UserIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function Step4({ onNext, onBack, data, isLoading }) {
    const [errors, setErrors] = useState({});
    const [isChecking, setIsChecking] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (isChecking || isLoading) return;

        setErrors({});

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        let tempErrors = {};

        if (!values.name || values.name.trim().split(' ').length < 2) {
            tempErrors.name = "Digite seu nome completo.";
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!values.username || !usernameRegex.test(values.username)) {
            tempErrors.username = "Use apenas letras, números e underline.";
        }
        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        setIsChecking(true);
        try {
            const exists = await authService.checkUsername(values.username);

            if (exists) {
                setErrors({ username: "Este nome de usuário já está sendo usado." });
                setIsChecking(false);
                return;
            }
            onNext(values);
        } catch (err) {
            setErrors({ username: "Erro ao validar usuário. Tente novamente." });
        } finally {
            setIsChecking(false);
        }
    };

    const getButtonLabel = () => {
        if (isChecking) return "Verificando...";
        if (isLoading) return "Criando conta...";
        return "Finalizar Cadastro";
    };

    return (
        <AuthFormWrapper
            title="Perfil"
            subtitle="Como você quer ser chamado na plataforma?"
            buttonLabel={getButtonLabel()}
            currentStep={4}
            totalSteps={4}
            onSubmit={handleSubmit}
            onBack={onBack}
            isLoading={isLoading || isChecking}
        >
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-5 w-5" />
                </div>
                <input
                    name="name"
                    type="text"
                    required
                    defaultValue={data.name}
                    placeholder="Nome completo"
                    className={`w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all appearance-none
                        ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <RocketLaunchIcon className="h-5 w-5" />
                </div>
                <input
                    name="username"
                    type="text"
                    required
                    defaultValue={data.username}
                    placeholder="Nome de usuário"
                    className={`w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all appearance-none
                        ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                />
                {errors.username && (
                    <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {errors.username}
                    </p>
                )}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
                Ao finalizar, você concorda com nossos <br />
                <span className="underline cursor-pointer hover:text-slate-600">Termos de Uso</span> e <span className="underline cursor-pointer hover:text-slate-600">Privacidade</span>.
            </p>

        </AuthFormWrapper>
    );
}