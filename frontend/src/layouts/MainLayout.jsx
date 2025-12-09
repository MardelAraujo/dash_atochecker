import React, { useState } from 'react';
import { LayoutDashboard, Users, Filter, Database, FileOutput, Settings, Menu, Upload, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-premium-purple text-white shadow-lg' : 'text-gray-400 hover:text-premium-magenta hover:bg-white/5'}`}>
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-premium-deep text-premium-light flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="fixed left-0 top-0 h-full z-20 glass-sidebar hidden md:flex flex-col"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-premium-magenta to-premium-purple flex items-center justify-center font-bold text-white">
                        A
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl tracking-tight">AutoDash</span>}
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
                    <SidebarItem icon={Users} label="Origem dos Leads" to="/origem" active={location.pathname === '/origem'} />
                    <SidebarItem icon={Filter} label="Conversão" to="/conversao" active={location.pathname === '/conversao'} />
                    <SidebarItem icon={Database} label="Qualidade" to="/qualidade" active={location.pathname === '/qualidade'} />
                    <SidebarItem icon={FileOutput} label="Exportações" to="/export" active={location.pathname === '/export'} />
                </nav>

                <div className="p-3">
                    <SidebarItem icon={Settings} label="Configurações" to="/settings" active={location.pathname === '/settings'} />
                </div>
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            {/* (Simplified for brevity, can add mobile menu logic here) */}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-[260px]' : 'md:ml-[80px]'}`}>

                {/* Sticky Header */}
                <header className="sticky top-0 z-10 glass-card border-x-0 border-t-0 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white">Dashboard de KPIs</h1>
                            <p className="text-xs text-gray-400">Leads & Performance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-premium-dark border border-premium-border hover:border-premium-magenta transition-colors text-sm">
                            <RefreshCw size={16} />
                            <span className="hidden sm:inline">Reprocessar</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-premium-magenta to-premium-purple text-white font-medium shadow-lg hover:shadow-premium-magenta/20 transition-all text-sm">
                            <Upload size={16} />
                            <span className="hidden sm:inline">Upload Planilha</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
