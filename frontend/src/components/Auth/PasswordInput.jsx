import { useState } from "react";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function PasswordInput({ ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <LockClosedIcon className="h-5 w-5" />
            </div>
            <input
                type={showPassword ? 'text' : 'password'}
                {...props}
                className={`${props.className} pr-12`}
            />
            <button
                type="button"
                onClick={toggleVisibility}
                tabIndex="-1"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                title={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
                {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                ) : (
                    <EyeIcon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;