import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import logo from '../../assets/icons/cogumelo.png';
import {
    LayoutDashboard,
    BookOpen,
    PencilRuler,
    Gamepad2,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    FileBarChart2,
    Users,
    Menu,
    X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, onOpen, isCollapsed, onToggleCollapse }) {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }

        return location.pathname.startsWith(path);
    };

    const { user, logout } = useAuth();

    const sair = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            navigate('/');
        }
    }

    const mainNavItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/dashboard/library', icon: BookOpen, label: 'Conteúdos' },

        user?.account_type === 'professor' ?
            { path: '/quiz/create', icon: PencilRuler, label: 'Criar Quiz' }
            :
            { path: '/dashboard/play', icon: Gamepad2, label: 'Jogar' },

        { path: '/dashboard/social', icon: Users, label: 'Chats' },
        { path: '/dashboard/reports', icon: FileBarChart2, label: 'Relatórios' },

    ];

    return (
        <>
            {!isOpen && (
                <button
                    onClick={onOpen}
                    className="md:hidden fixed top-4 left-4 z-60 p-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors"
                >
                    <Menu size={24} />
                </button>
            )}

            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-70 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            >
                <button className="absolute top-4 right-4 text-white">
                    <X size={32} />
                </button>
            </div>

            <aside
                className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none transition-all duration-300 ease-in-out z-80
                    /* No mobile é sempre w-72. No PC, varia conforme isCollapsed */
                    w-72 ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className={`flex items-center h-20 border-b border-slate-100 shrink-0 px-6 ${isCollapsed ? 'md:justify-center md:px-0' : 'md:px-6'}`}>
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-emerald-50 p-1.5 shrink-0" />
            
                    <span className={`ml-1 font-bold text-xl text-slate-800 transition-opacity duration-200 truncate overflow-hidden whitespace-nowrap
                        ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                        Classroom Quizz
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <nav>
                        <ul className="space-y-1">
                            {mainNavItems.map((item) => {
                                const active = isActive(item.path);
                                const Icon = item.icon;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => window.innerWidth < 768 && onClose()}
                                            className={`flex items-center rounded-xl transition-all duration-200 group px-4 py-3 gap-4
                                                ${isCollapsed ? 'md:justify-center md:px-0 md:gap-0' : ''}
                                                ${active ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                            `}
                                        >
                                            <Icon size={22} className={`shrink-0 ${active ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                                            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 
                                                ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-1">

                    <button
                        onClick={onToggleCollapse}
                        className={`hidden md:flex w-full items-center rounded-xl text-slate-500 hover:bg-white hover:shadow-sm transition-all duration-200 px-4 py-3 gap-4
                            ${isCollapsed ? 'md:justify-center md:px-0 md:gap-0' : ''}
                        `}
                    >
                        {isCollapsed ? <ChevronsRight size={22} /> : <ChevronsLeft size={22} />}
                        <span className={`font-medium transition-opacity duration-200 ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                            Recolher
                        </span>
                    </button>

                    <Link
                        to="/dashboard/config"
                        onClick={() => window.innerWidth < 768 && onClose()}
                        className={`flex items-center rounded-xl text-slate-500 hover:bg-white hover:shadow-sm transition-all duration-200 px-4 py-3 gap-4
                            ${isCollapsed ? 'md:justify-center md:px-0 md:gap-0' : ''}
                        `}
                    >
                        <Settings size={22} />
                        <span className={`font-medium transition-opacity duration-200 ${isCollapsed ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                            Configurações
                        </span>
                    </Link>

                    {/* RETIRAR, COLOQUEI APENAS PARA FACILITAR O LOGOUT NO DESENVOLVIMENTO */}
                    <p onClick={sair} className='text-center bg-red-800 text-md text-white rounded-full'>Sair</p>
                </div>

                {!isCollapsed && (
                    <div className="text-xs text-slate-400 text-center mb-1 font-light">
                        Classroom Quizz v1.0
                    </div>
                )}
            </aside>
        </>
    );
}