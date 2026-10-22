import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../services/dashboardService';
import TeacherDashboard from '../../components/Dashboard/Dashboard/TeacherDashboard';
import StudentDashboard from '../../components/Dashboard/Dashboard/StudentDashboard';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getSummary();
            setDashboardData(data);
        } catch (err) {
            console.error("Erro ao carregar Dashboard:", err);
            setError("Não foi possível carregar as informações do seu painel agora.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        let greeting = 'Boa noite';

        if (hour < 12 && hour > 6) {
            greeting = 'Bom dia';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Boa tarde';
        }

        return greeting;
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
                <header className="space-y-3">
                    <div className="h-10 w-64 bg-slate-200 rounded-xl" />
                    <div className="h-5 w-96 bg-slate-100 rounded-lg" />
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                    <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                    <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                </div>
                <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100" />
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="p-8">
                <div className="mx-auto max-w-xl bg-white border border-red-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Ops! Algo deu errado</h3>
                        <p className="text-slate-500 mt-1">{error || "Não conseguimos conectar ao servidor."}</p>
                    </div>
                    <button
                        onClick={loadUserData}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all active:scale-95"
                    >
                        <RefreshCcw className="w-4 h-4" /> Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    const { user, stats, recentQuizzes } = dashboardData;
    const isProfessor = user?.accountType === 'professor';

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-50/40 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        {getGreeting()}, <span className="text-emerald-600">{user?.fullName?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        {isProfessor
                            ? 'Aqui está o resumo das suas atividades e turmas.'
                            : 'Continue seus estudos e veja seu progresso.'}
                    </p>
                </div>
            </header>

            <section className="relative z-10">
                {isProfessor ? (
                    <TeacherDashboard
                        user={user}
                        stats={stats}
                        recentQuizzes={recentQuizzes}
                    />
                ) : (
                    <StudentDashboard
                        user={user}
                        stats={stats}
                        recentQuizzes={recentQuizzes}
                    />
                )}
            </section>
        </main>
    );
}