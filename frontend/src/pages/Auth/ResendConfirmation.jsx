import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import AuthFormWrapper from '../../components/Auth/AuthFormWrapper';
import { CheckCircleIcon, EnvelopeOpenIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { authService } from '../../services/authService';

export default function ResendConfirmationEmail() {
    const location = useLocation();

    const emailFromRegistration = !!location.state?.email;
    const backendMessage = location.state?.message || "Conta criada com sucesso! Verifique sua caixa de entrada.";

    const [email, setEmail] = useState(location.state?.email || '');

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: ''
    });

    const handleResend = async (e) => {
        e.preventDefault();

        if (status.loading) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ loading: false, error: 'Por favor, insira um e-mail válido.', success: '' });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await authService.resendEmail(email);

            setStatus({
                loading: false,
                error: '',
                success: response.message
            });
        } catch (err) {
            setStatus({
                loading: false,
                error: err.response?.data?.error || err.message || 'Erro ao reenviar.',
                success: ''
            });
        }
    };

    return (
        <AuthFormWrapper
            title={emailFromRegistration ? "Verifique seu E-mail" : "Reenviar Confirmação"}
            buttonLabel={status.loading ? "Enviando..." : "Enviar novo link"}
            onSubmit={handleResend}
            isLoading={status.loading}
            footer={
                <p className="text-slate-500 text-sm">
                    Já confirmou sua conta?{' '}
                    <Link to="/auth" className="text-emerald-700 font-bold hover:underline">
                        Fazer login
                    </Link>
                </p>
            }
        >

            {emailFromRegistration ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center flex flex-col items-center">
                    <CheckCircleIcon className="h-12 w-12 text-emerald-500 mb-3" />
                    <p className="text-emerald-800 font-medium mb-1">
                        {backendMessage}
                    </p>
                    <p className="text-sm text-emerald-600 mt-2">
                        Enviamos um link para: <br />
                        <strong className="text-emerald-900">{email}</strong>
                    </p>
                </div>
            ) : (
                <p className="text-slate-600 text-center mb-6 px-2">
                    {backendMessage}
                </p>
            )}

            {!emailFromRegistration && (
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <input name="email" type="email" required value={email} placeholder="seu@email.com"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status.error) setStatus(prev => ({ ...prev, error: '' }));
                        }}

                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all 
                                ${status.error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                    />
                </div>
            )}

            {status.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                    <p className="text-sm text-red-700">{status.error}</p>
                </div>
            )}

            {status.success && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-xl flex items-center gap-3">
                    <EnvelopeOpenIcon className="h-6 w-6 text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-700">{status.success}</p>
                </div>
            )}

            {emailFromRegistration && !status.success && (
                <div className="text-center mb-2 px-2">
                    <p className="text-sm text-slate-600">
                        Não encontrou o e-mail? Se ele não chegar em alguns minutos, clique no botão abaixo para tentar novamente.
                    </p>
                </div>
            )}

        </AuthFormWrapper>
    );
}