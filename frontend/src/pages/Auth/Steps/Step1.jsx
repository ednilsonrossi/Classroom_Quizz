import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../../../components/Auth/AuthFormWrapper';
import PasswordInput from '../../../components/Auth/PasswordInput';
import { authService } from '../../../services/authService';
import { EnvelopeIcon, LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function Step1({ onNext, data }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: data.email || '',
        password: data.password || '',
        confirmPassword: data.confirmPassword || ''
    });

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: '',
        errorCode: null
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
        if (status.error) setStatus(prev => ({ ...prev, error: '', errorCode: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (status.loading) return;

        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Por favor, insira um e-mail válido.";
        }
        if (formData.password.length < 8) {
            tempErrors.password = "A senha deve ter pelo menos 8 caracteres.";
        }
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "As senhas não coincidem!";
        }

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }
        setStatus(prev => ({ ...prev, loading: true, error: '' }));

        try {
            const emailExists = await authService.checkEmail(formData.email);

            if (emailExists) {
                setFieldErrors({ email: "Este e-mail já está em uso por outra conta." });
                setStatus(prev => ({ ...prev, loading: false }));
                return;
            }
            onNext(formData);
        } catch (err) {
            setStatus(prev => ({
                ...prev,
                loading: false,
                error: "Erro ao verificar e-mail. Tente novamente."
            }));
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
        }
    }


    return (
        <AuthFormWrapper
            title="Criar Conta"
            buttonLabel={status.loading ? "Verificando..." : "Próximo Passo"}
            currentStep={1}
            totalSteps={4}
            onSubmit={handleSubmit}
            isLoading={status.loading}
        >

            {/* Mensagem de Feedback */}
            {status.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-sm text-red-700">{status.error}</p>
                </div>
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    maxLength={100}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-2 transition-all 
                            ${fieldErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-500'}`}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.email}</p>}
            </div>

            <div className="relative">
                <PasswordInput
                    name='password'
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange} placeholder="Sua senha"
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

            <p className="mt-8 text-center text-slate-400 text-sm">
                Já tem uma conta? <button onClick={() => navigate('/auth')} className="text-emerald-600 font-bold hover:underline">Entrar</button>
            </p>
        </AuthFormWrapper>
    );
}