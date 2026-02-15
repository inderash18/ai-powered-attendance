import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChart2,
    Users,
    UserPlus,
    Video,
    FileText,
    Settings,
    LogOut,
    Search,
    Bell,
    Clock,
    ChevronRight
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, badge }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-[#f9fafb] text-[var(--foreground)]"
                : "text-[var(--secondary)] hover:bg-[#f9fafb] hover:text-[var(--foreground)]"
                }`}
        >
            <Icon size={18} className={isActive ? "text-[var(--primary)]" : "text-[var(--secondary)]"} />
            <span className="flex-1">{label}</span>
            {badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#f2f4f7] text-[#344054] border border-[#d0d5dd]">
                    {badge}
                </span>
            )}
        </Link>
    );
};

export const Shell = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)]">
            {/* Sidebar */}
            <aside className="w-[280px] border-r border-[var(--border)] bg-white flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold italic">
                            V
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">SmartView</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="px-3 mb-2 text-[11px] font-bold text-[var(--secondary)] uppercase tracking-wider">Dashboard</p>
                            <nav className="space-y-1">
                                <SidebarItem to="/" icon={BarChart2} label="Overview" />
                                <SidebarItem to="/monitoring" icon={Video} label="Live Monitoring" />
                            </nav>
                        </div>

                        <div>
                            <p className="px-3 mb-2 text-[11px] font-bold text-[var(--secondary)] uppercase tracking-wider">Management</p>
                            <nav className="space-y-1">
                                <SidebarItem to="/students" icon={Users} label="Students" />
                                <SidebarItem to="/enrollment" icon={UserPlus} label="Enrollment" />
                                <SidebarItem to="/reports" icon={FileText} label="AI Reports" />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-[var(--border)]">
                    <div className="p-3 bg-[#f9fafb] rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d0d5dd] flex items-center justify-center font-bold text-sm">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-[var(--foreground)]">John Doe</p>
                            <p className="text-xs text-[var(--secondary)] truncate">Admin Account</p>
                        </div>
                        <button className="text-[var(--secondary)] hover:text-[var(--foreground)]">
                            <Settings size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-[var(--border)] bg-white px-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search students, records, or sessions..."
                                className="w-full bg-[#f9fafb] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#fef3f2] text-[#b42318] rounded-full border border-[#fda29b] text-[10px] font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#d92d20] animate-pulse" />
                            Live Feed
                        </div>
                        <button className="p-2 text-[var(--secondary)] hover:bg-[#f9fafb] rounded-lg transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--error)] rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};
