import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import AuthFormWrapper from "../../components/Auth/AuthFormWrapper";
import AppButton from "../../components/Buttons/AppButton";
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function EmailConfirmation() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const hasRequested = useRef(false);

    const [status, setStatus] = useState({
        loading: true,
        error: '',
        success: ''
    });

    useEffect(() => {
        if (!token) {
            setStatus({
                loading: false,
                error: 'Link de confirmação inválido ou incompleto (token ausente).',
                success: ''
            });
            return;
        }
        if (hasRequested.current) return;

        const confirmAccount = async () => {
            hasRequested.current = true;

            try {
                const result = await authService.confirmEmail(token);

                setStatus({
                    loading: false,
                    error: '',
                    success: result.message || 'Sua conta foi ativada com sucesso!'
                });

                const timer = setTimeout(() => {
                    navigate('/auth', {
                        state: { successMessage: 'E-mail confirmado! Faça seu login.' }
                    });
                }, 6000);

                return () => clearTimeout(timer);

            } catch (error) {
                setStatus({
                    loading: false,
                    error: error.response?.data?.error || 'O link de confirmação expirou ou já foi utilizado.',
                    success: ''
                });
            }
        };

        confirmAccount();
    }, [token, navigate]);

    return (
        <AuthFormWrapper
            title="Confirmação de Conta"
            onSubmit={(e) => e.preventDefault()}
        >

            <div className="flex flex-col items-center text-center py-4">

                {status.loading && (
                    <>
                        <ArrowPathIcon className="h-16 w-16 text-emerald-500 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Validando link...</h3>
                        <p className="text-slate-600">
                            Aguarde um momento enquanto ativamos sua conta em nosso sistema.
                        </p>
                    </>
                )}

                {status.success && (
                    <>
                        <div className="bg-emerald-100 p-4 rounded-full mb-4">
                            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">E-mail Confirmado!</h3>
                        <p className="text-emerald-700 font-medium mb-6">
                            {status.success}
                        </p>
                        <p className="text-sm text-slate-500 mb-8">
                            Você será redirecionado para o login em alguns segundos...
                        </p>

                        <AppButton href="/auth" variant="secondary" className="flex-1 w-full py-3 rounded-full text-lg shadow-lg">
                            Ir para Login agora
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </AppButton>
                    </>
                )}

                {status.error && (
                    <>
                        <div className="bg-red-100 p-4 rounded-full mb-4">
                            <XCircleIcon className="h-12 w-12 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ops! Algo deu errado</h3>
                        <p className="text-red-600 mb-8 px-4">
                            {status.error}
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <AppButton href="/auth/verify-email" variant="primary" className="flex-1 w-full py-3 rounded-full text-lg shadow-lg shadow-amber-200">
                                Solicitar novo link
                            </AppButton>

                            <Link to="/auth" className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                                Voltar para o Login
                            </Link>
                        </div>
                    </>
                )}

            </div>
        </AuthFormWrapper>
    );
}