import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="bg-emerald-50/40 py-12 px-4 min-h-[60vh] flex items-center justify-center">

            <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                <Outlet />
            </div>
        </div>
    );
}