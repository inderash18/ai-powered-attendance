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
    ChevronRight,
    Command
} from 'lucide-react';
import { Badge } from '../../components/enterprise';

const SidebarItem = ({ to, icon: Icon, label, badge }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive
                ? "bg-primary-50 text-primary-900 shadow-sm ring-1 ring-primary-200"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
        >
            <Icon size={18} className={`transition-colors ${isActive ? "text-primary-600" : "text-neutral-400 group-hover:text-neutral-600"}`} />
            <span className="flex-1">{label}</span>
            {badge && (
                <Badge variant="neutral" size="sm" className="!px-1.5 !py-0.5 !text-[10px]">
                    {badge}
                </Badge>
            )}
        </Link>
    );
};

export const Shell = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans">
            {/* Sidebar */}
            <aside className="w-[280px] border-r border-neutral-200 bg-white flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-xl italic leading-none pt-1 pr-0.5">V</span>
                        </div>
                        <div>
                            <span className="block text-lg font-bold tracking-tight text-neutral-900 leading-none">SmartView</span>
                            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Enterprise</span>
                        </div>
                    </Link>

                    <div className="space-y-8">
                        <div>
                            <p className="px-3 mb-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Analytics Interface</p>
                            <nav className="space-y-1">
                                <SidebarItem to="/" icon={BarChart2} label="Overview" />
                                <SidebarItem to="/monitoring" icon={Video} label="Live Monitoring" badge="Active" />
                            </nav>
                        </div>

                        <div>
                            <p className="px-3 mb-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Management</p>
                            <nav className="space-y-1">
                                <SidebarItem to="/students" icon={Users} label="Students" />
                                <SidebarItem to="/enrollment" icon={UserPlus} label="Enrollment" />
                                <SidebarItem to="/reports" icon={FileText} label="AI Reports" />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-neutral-100">
                    <div className="p-3 rounded-xl flex items-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-sm text-neutral-600 group-hover:bg-white group-hover:shadow-md transition-all">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-neutral-900">John Doe</p>
                            <p className="text-xs text-neutral-500 truncate font-medium">Administrator</p>
                        </div>
                        <button className="text-neutral-400 hover:text-primary-600 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-neutral-50/50">
                <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-xl px-8 flex items-center justify-between gap-4 sticky top-0 z-10 transition-shadow hover:shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search students, records, or sessions..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2.5 pl-10 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium placeholder:text-neutral-400"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
                                <span className="text-[10px] font-bold text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5 shadow-sm">ESC</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-error-50 text-error-700 rounded-full border border-error-200 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-error-500 animate-pulse shadow-[0_0_8px] shadow-error-500/50" />
                            Live Feed
                        </div>
                        <div className="h-6 w-px bg-neutral-200 mx-1" />
                        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors relative hover:text-primary-600">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
