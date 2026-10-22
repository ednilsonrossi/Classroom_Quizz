import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthFormWrapper from '../../components/Auth/AuthFormWrapper';
import { CheckCircleIcon, EnvelopeOpenIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { authService } from '../../services/authService';

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (status.loading) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ loading: false, error: 'Por favor, insira um e-mail válido.', success: '' });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await authService.forgotPassword(email);

            setStatus({
                loading: false,
                error: '',
                success: response.message
            });
        } catch (err) {
            setStatus({
                loading: false,
                error: err.response?.data?.error || err.message || 'Erro ao enviar.',
                success: ''
            });
        }
    };

    return (
        <AuthFormWrapper
            title="Esqueceu a senha?"
            buttonLabel={!status.success ? (status.loading ? "Enviando..." : "Enviar link") : null}
            onSubmit={handleSubmit}
            footer={
                <div className="text-center mt-6">
                    <Link to="/auth" className="text-sm text-slate-500 hover:underline">
                        Voltar para o Login
                    </Link>
                </div>
            }
            isLoading={status.loading}
        >
            
            <div className="py-2">
                {!status.success ? (
                    <>
                        <p className="text-slate-600 text-sm text-center mb-6">
                            Insira seu e-mail abaixo. Enviaremos um link seguro para você criar uma nova senha.
                        </p>

                        {status.error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl animate-shake">
                                <p className="text-sm text-red-700">{status.error}</p>
                            </div>
                        )}

                        <div className="relative mb-2">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <EnvelopeIcon className="h-5 w-5" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                value={email}
                                placeholder="seu@email.com"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status.error) setStatus(prev => ({ ...prev, error: '' }));
                                }}
                                className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all 
                                ${status.error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center py-4 animate-fade-in">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <EnvelopeOpenIcon className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Verifique seu e-mail</h3>
                        <p className="text-slate-600 text-sm mt-2 mb-6">
                            {status.success || "Enviamos as instruções para o seu e-mail."}
                        </p>
                    </div>
                )}
            </div>
        </AuthFormWrapper>
    );
}