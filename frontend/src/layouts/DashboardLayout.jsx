import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DashboardLayout() {
    const [isOpen, setIsOpen] = useState(false);         
    const [isCollapsed, setIsCollapsed] = useState(false); 

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            <main className={`flex-1 transition-all duration-300 
                ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>

                <Outlet /> 
            </main>
        </div>
    );
}