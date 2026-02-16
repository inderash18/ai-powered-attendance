import React from 'react';
import { EnterpriseCard, StatCard, Button, Badge } from '../components/enterprise';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '08:00', engagement: 82, attendance: 90 },
    { name: '09:00', engagement: 75, attendance: 92 },
    { name: '10:00', engagement: 88, attendance: 94 },
    { name: '11:00', engagement: 80, attendance: 94 },
    { name: '12:00', engagement: 85, attendance: 91 },
    { name: '13:00', engagement: 90, attendance: 95 },
    { name: '14:00', engagement: 84, attendance: 94 },
];

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
                <StatCard label="Total Enrollment" value={stats.total_students} change="+5%" trend="up" icon={Users} />
                <StatCard label="Avg. Engagement" value={stats.avg_engagement} change="-2%" trend="down" icon={Target} />
                <StatCard label="Today's Attendance" value={stats.today_attendance} change="Verified" trend="neutral" icon={AlertCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Engagement Trend */}
                <EnterpriseCard title="Analytic Trends" subtitle="Session engagement vs attendance over time" className="lg:col-span-2">
                    <div className="h-[320px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="engagement" stroke="var(--primary-600)" strokeWidth={2} fillOpacity={1} fill="url(#colorEngage)" />
                                <Area type="monotone" dataKey="attendance" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </EnterpriseCard>

                {/* AI Insights Card */}
                <EnterpriseCard title="Intelligence Report" subtitle="Automated localized neural analysis" variant="gradient" className="bg-gradient-to-br from-primary-50 to-white">
                    <div className="space-y-6">
                        <div className="p-4 bg-white border border-primary-100 rounded-xl shadow-sm">
                            <div className="flex gap-3 mb-3">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <TrendingUp className="text-primary-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">Neural Audit</p>
                                    <p className="text-sm font-semibold mt-0.5">Ollama Generative Report</p>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed italic whitespace-pre-wrap font-medium">
                                {stats.ai_insight}
                            </p>
                        </div>

                        <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Action Items</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-xs text-neutral-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Review attendance logs for Section B
                                </li>
                                <li className="flex items-center gap-2 text-xs text-neutral-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    Issue risk notices to 4 students
                                </li>
                            </ul>
                        </div>
                    </div>
                </EnterpriseCard>
            </div>

            {/* Latest Attendance Table */}
            <EnterpriseCard title="Session Attendance Log" subtitle="Recent identifiers detected and verified">
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Identifier</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Engagement</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Last Check-in</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {[
                                { id: 'STU-4401', name: 'Aiden Marcus', status: 'In-Session', engagement: '94%', time: '2m ago' },
                                { id: 'STU-4402', name: 'Zoe Vance', status: 'In-Session', engagement: '88%', time: '5m ago' },
                                { id: 'STU-4403', name: 'Liam Thorne', status: 'Risk Check', engagement: '24%', time: '12m ago', alert: true },
                                { id: 'STU-4404', name: 'Sophia Chen', status: 'In-Session', engagement: '91%', time: '14m ago' },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-600">
                                                {row.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-neutral-900">{row.name}</p>
                                                <p className="text-[10px] text-neutral-500">{row.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <Badge variant={row.alert ? 'error' : 'success'} dot>{row.status}</Badge>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${parseInt(row.engagement) > 80 ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: row.engagement }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-600">{row.engagement}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="text-xs text-neutral-500 font-medium">{row.time}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </EnterpriseCard>
        </div>
    );
}
