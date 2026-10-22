import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import AuthFormWrapper from "../../components/Auth/AuthFormWrapper";
import AppButton from "../../components/Buttons/AppButton";
import PasswordInput from "../../components/Auth/PasswordInput";
import { CheckCircleIcon, XCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: '',
        isTokenError: false
    });

    const isTokenInvalid = !token || status.isTokenError;
    const showInputs = !status.success && !isTokenInvalid;

    useEffect(() => {
        if (!token) {
            setStatus(prev => ({ ...prev, error: 'Link de redefinição inválido ou expirado.', isTokenError: true }));
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status.loading || isTokenInvalid) return;

        let errors = {};
        if (formData.password.length < 8) errors.password = "A senha deve ter no mínimo 8 caracteres.";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "As senhas não coincidem.";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await authService.resetPassword(token, formData.password);

            setStatus({
                loading: false,
                error: '',
                success: response.message || 'Senha alterada com sucesso!',
                isTokenInvalid: false
            });

            setTimeout(() => {
                navigate('/auth', { state: { successMessage: 'Nova senha salva! Faça login.' } });
            }, 3000);

        } catch (err) {
            const message = err.message || 'Erro ao redefinir senha.';
            const isFatalError = message.toLowerCase().includes('token') || message.toLowerCase().includes('link') || message.toLowerCase().includes('expirado');

            setStatus({
                loading: false,
                success: '',
                error: err.message || 'Erro ao redefinir senha. O link pode ter expirado.',
                isTokenError: isFatalError
            });
        }
    };

    return (
        <AuthFormWrapper
            title="Redefinir Senha"
            buttonLabel={showInputs ? (status.loading ? "Salvando..." : "Atualizar senha") : null}
            onSubmit={handleSubmit}
            footer={
                <div className="text-center mt-6">
                    <Link to="/auth" className="text-sm text-slate-500 hover:underline">
                        Voltar para o Login
                    </Link>
                </div>
            }
        >
            <div className="flex flex-col gap-4 py-4">

                {status.success && (
                    <div className="flex flex-col items-center text-center animate-fade-in">
                        <div className="bg-emerald-100 p-4 rounded-full mb-4">
                            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Tudo pronto!</h3>
                        <p className="text-slate-600 mb-4">{status.success}</p>
                    </div>
                )}

                {isTokenInvalid ? (
                    <div className="flex flex-col items-center text-center">
                        <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
                        <p className="text-red-600 font-medium mb-6">{status.error}</p>
                        <AppButton href="/auth/forgot-password" variant="primary" className="flex-1 w-full py-4 rounded-full text-lg shadow-lg">
                            Solicitar novo link
                        </AppButton>
                    </div>
                ) : (
                    showInputs && (
                        <>

                            {status.error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl animate-shake">
                                    <p className="text-sm text-red-700 font-medium">{status.error}</p>
                                </div>
                            )}

                            <p className="text-slate-600 text-sm text-center mb-4">
                                Digite sua nova senha abaixo para recuperar o acesso à sua conta.
                            </p>

                            <div className="relative">
                                <PasswordInput
                                    name='password'
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Sua senha"
                                    minLength={8}
                                    maxLength={255}
                                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all 
                                ${fieldErrors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                                    required />
                                {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.password}</p>}
                            </div>

                            <div className="relative">
                                <PasswordInput
                                    name='confirmPassword'
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange} placeholder="Confirmar senha"
                                    minLength={8}
                                    maxLength={255}
                                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all 
                                ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                                    required />
                                {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.confirmPassword}</p>}
                            </div>
                        </>
                    )
                )
                }

            </div>
        </AuthFormWrapper >
    );
}