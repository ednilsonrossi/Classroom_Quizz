import AppButton from "../Buttons/AppButton";

export default function AuthFormWrapper({
    children,
    footer,
    title,
    subtitle,
    buttonLabel,
    onSubmit,
    onBack,
    currentStep = 0,
    totalSteps = 0,
    isLoading = false,
    formRef
}) {
    return (
        <div>
            {totalSteps > 0 && (
                <div className="flex justify-center gap-2 mb-6">
                    {[...Array(totalSteps)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${(i + 1) <= currentStep ? 'w-12 bg-amber-500' : 'w-8 bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            )}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-slate-500 mt-2 text-sm font-mono">
                        {subtitle}
                    </p>
                )}
            </div>

            <form ref={formRef} onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()} className="space-y-5">

                {children}

                <div className="flex flex-col sm:flex-row-reverse gap-3 mt-6">

                    {buttonLabel && (
                        <AppButton
                            variant="primary"
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1 w-full py-4 rounded-full text-lg shadow-lg shadow-amber-200"
                        >
                            {buttonLabel}
                        </AppButton>
                    )}

                    {onBack && (
                        <AppButton
                            type="button"
                            variant="ghost"
                            onClick={onBack}
                            className="flex-1 w-full py-2  rounded-full"
                        >
                            Voltar
                        </AppButton>
                    )}
                </div>
            </form>

            {footer && (
                <div className="mt-8 text-center">
                    {footer}
                </div>
            )}

        </div>
    )
}