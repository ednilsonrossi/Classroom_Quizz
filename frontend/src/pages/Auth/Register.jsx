import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";

export default function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const handleNextStep = (stepData) => {
        setGlobalError("");
        setFormData((prev) => ({ ...prev, ...stepData }));
        setStep((prev) => prev + 1);
    };

    const handleBackStep = () => {
        setGlobalError("");
        setStep((prev) => prev - 1);
    };

    const handleFinalSubmit = async (finalData) => {
        if (isLoading) return;
        setIsLoading(true);
        setGlobalError("");

        const fullData = { ...formData, ...finalData };

        const payload = {
            email: fullData.email,
            password: fullData.password,
            nome_completo: fullData.name,
            username: fullData.username,
            nascimento: fullData.birthday,
            tipo_conta: fullData.account_type
        };
        try {
            const response = await authService.register(payload);

            if (response) {
                navigate('/auth/verify-email', {
                    state: {
                        email: payload.email,
                        message: "Conta criada com sucesso!"
                    }
                })
            }
        } catch (err) {
            const errorMessage = err.message || "Erro inesperado. Tente novamente.";
            setGlobalError(errorMessage);
            console.log(err.response.data);

            if (err.response?.status === 409 || errorMessage.toLowerCase().includes("email")) {
                setStep(1);
            } else if (errorMessage.toLowerCase().includes("usuário") || errorMessage.toLowerCase().includes("username")) {
                setStep(4);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main>
            {globalError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-sm text-red-700">{globalError}</p>
                </div>
            )}

            <div>
                {step === 1 && <Step1 onNext={handleNextStep} data={formData} />}
                {step === 2 && <Step2 onNext={handleNextStep} onBack={handleBackStep} data={formData} />}
                {step === 3 && <Step3 onNext={handleNextStep} onBack={handleBackStep} data={formData} />}
                {step === 4 && <Step4 onNext={handleFinalSubmit} onBack={handleBackStep} data={formData} isLoading={isLoading} />}
            </div>

        </main>



    );
}