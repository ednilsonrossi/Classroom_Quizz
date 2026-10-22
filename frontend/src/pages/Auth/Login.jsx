import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import AuthFormWrapper from '../../components/Auth/AuthFormWrapper';
import PasswordInput from '../../components/Auth/PasswordInput';
import AppButton from '../../components/Buttons/AppButton';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: '',
        errorCode: null
    });

    const [showResendLink, setShowResendLink] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (status.error) setStatus(prev => ({ ...prev, error: '', errorCode: null }));
        if (showResendLink) setShowResendLink(false);
    };

    const handleResendConfirmation = async () => {
        setStatus(prev => ({ ...prev, loading: true, error: '' }));
        try {
            await authService.resendEmail(formData.email);
            setStatus(prev => ({ ...prev, success: 'E-mail de confirmação reenviado!', loading: false }));
            setShowResendLink(false);
        } catch (err) {
            setStatus(prev => ({ ...prev, error: err.message, loading: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (status.loading) return;

        if (!formData.email || !formData.password) {
            setStatus(prev => ({ ...prev, error: 'Preencha todos os campos.' }));
            return;
        }

        setStatus(prev => ({ ...prev, loading: true, error: '' }));

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setStatus({
                loading: false,
                error: result.message,
                errorCode: result.code
            });

            if (result.code === 'EMAIL_NOT_CONFIRMED') {
                setShowResendLink(true);
            }
        }
    };

    return (
        <AuthFormWrapper
            title="Login"
            buttonLabel={status.loading ? "Entrando..." : "Entrar na Plataforma"}
            onSubmit={handleSubmit}
            isLoading={status.loading}
            footer={
                <p className="text-slate-500 text-sm">
                    Não possui uma conta?{' '}
                    <Link to="/auth/register" className="text-emerald-700 font-bold hover:underline">
                        Criar conta agora
                    </Link>
                </p>
            }
        >

            {status.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-sm text-red-700">{status.error}</p>
                    {showResendLink && (
                        <AppButton
                            onClick={handleResendConfirmation}
                            variant='ghost'
                            size='sm'
                            isLoading={status.loading}
                            className="mt-2 bg-transparent! border-none! p-0! text-red-800 underline hover:text-red-900"
                        >
                            Reenviar link de confirmação
                        </AppButton>
                    )}
                </div>
            )}

            {status.success && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-sm text-emerald-700">{status.success}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                    E-mail
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                        <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        maxLength={100}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                    Senha
                </label>
                <div className="relative group">
                    <PasswordInput
                        name='password'
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange} placeholder="••••••••"
                        minLength={8}
                        maxLength={255}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        required />
                </div>
            </div>

            <div className="flex justify-end pr-1">
                <Link
                    to="/auth/forgot-password"
                    name="password"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-600 transition-colors"
                >
                    Esqueceu sua senha?
                </Link>
            </div>

        </AuthFormWrapper>
    );
}