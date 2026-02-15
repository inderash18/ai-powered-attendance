import React from 'react';
import { Card, Badge, Button } from '../components/ui';
import {
    Users,
    Target,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Download,
    Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
    { name: '08:00', engagement: 82, attendance: 90 },
    { name: '09:00', engagement: 75, attendance: 92 },
    { name: '10:00', engagement: 88, attendance: 94 },
    { name: '11:00', engagement: 80, attendance: 94 },
    { name: '12:00', engagement: 85, attendance: 91 },
    { name: '13:00', engagement: 90, attendance: 95 },
    { name: '14:00', engagement: 84, attendance: 94 },
];

const StatCard = ({ title, value, change, trend, icon: Icon }) => (
    <Card className="flex-1">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-[var(--secondary)] mb-1">{title}</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
            </div>
            <div className="p-2 bg-[#f9fafb] border border-[var(--border)] rounded-lg">
                <Icon className="text-[var(--secondary)]" size={20} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
            </span>
            <span className="text-[10px] text-[var(--secondary)] font-medium">vs yesterday</span>
        </div>
    </Card>
);

export default function Dashboard() {
    const [stats, setStats] = React.useState({
        total_students: "0",
        avg_engagement: "0%",
        today_attendance: "0",
        ai_insight: "Initializing AI models..."
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/analytics/overview");
                const data = await res.json();
                setStats({
                    total_students: data.total_students.toLocaleString(),
                    avg_engagement: data.avg_engagement + "%",
                    today_attendance: data.today_attendance.toLocaleString(),
                    ai_insight: data.ai_insight
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-space max-w-[1400px] mx-auto">
            <header className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Institutional Overview</h1>
                    <p className="text-[var(--secondary)] text-sm">Real-time attendance and engagement audit for Semester 2, 2026.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Calendar className="mr-2" size={16} />
                        This Semester
                    </Button>
                    <Button>
                        <Download className="mr-2" size={16} />
                        Export Audit
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Enrollment" value={stats.total_students} change="Live" trend="up" icon={Users} />
                <StatCard title="Avg. Engagement" value={stats.avg_engagement} change="Current" trend="up" icon={Target} />
                <StatCard title="Today's Attendance" value={stats.today_attendance} change="Verified" trend="up" icon={AlertCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Engagement Trend */}
                <Card title="Analytic Trends" subtitle="Session engagement vs attendance over time" className="lg:col-span-2">
                    <div className="h-[320px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #eaecf0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="engagement" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorEngage)" />
                                <Area type="monotone" dataKey="attendance" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* AI Insights Card */}
                <Card title="Intelligence Report" subtitle="Automated localized neural analysis" className="bg-[#f0f9ff]/30 border-[#b2ddff]/50">
                    <div className="space-y-6">
                        <div className="p-4 bg-white border border-[#b2ddff] rounded-xl shadow-sm">
                            <div className="flex gap-3 mb-3">
                                <div className="p-2 bg-[#eff8ff] rounded-lg">
                                    <TrendingUp className="text-[#175cd3]" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#175cd3] uppercase tracking-wider">Neural Audit</p>
                                    <p className="text-sm font-semibold mt-0.5">Ollama Generative Report</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-[#475467] leading-relaxed italic whitespace-pre-wrap">
                                {stats.ai_insight}
                            </p>
                        </div>

                        <div className="p-4 bg-white border border-[#eaecf0] rounded-xl">
                            <p className="text-xs font-bold text-[#344054] uppercase tracking-wider mb-2">Action Items</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-xs text-[#475467]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    Review attendance logs for Section B
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[#475467]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                    Issue risk notices to 4 students
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Latest Attendance Table */}
            <Card title="Session Attendance Log" subtitle="Recent identifiers detected and verified">
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#eaecf0]">
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Identifier</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Status</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Engagement</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider text-right">Last Check-in</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaecf0]">
                            {[
                                { id: 'STU-4401', name: 'Aiden Marcus', status: 'In-Session', engagement: '94%', time: '2m ago' },
                                { id: 'STU-4402', name: 'Zoe Vance', status: 'In-Session', engagement: '88%', time: '5m ago' },
                                { id: 'STU-4403', name: 'Liam Thorne', status: 'Risk Check', engagement: '24%', time: '12m ago', alert: true },
                                { id: 'STU-4404', name: 'Sophia Chen', status: 'In-Session', engagement: '91%', time: '14m ago' },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-[#f9fafb] transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#f2f4f7] flex items-center justify-center font-bold text-xs text-[#344054]">
                                                {row.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[var(--foreground)]">{row.name}</p>
                                                <p className="text-[10px] text-[var(--secondary)]">{row.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <Badge status={row.alert ? 'error' : 'success'}>{row.status}</Badge>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--primary)]" style={{ width: row.engagement }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-[var(--secondary)]">{row.engagement}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="text-xs text-[var(--secondary)] font-medium">{row.time}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
