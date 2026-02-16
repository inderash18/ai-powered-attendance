import React, { useState, useEffect } from 'react';
import { EnterpriseCard, Button, Badge } from '../components/enterprise';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
    const [reportType, setReportType] = useState('weekly');
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock data for charts
    const engagementData = [
        { name: 'Mon', engagement: 85, attendance: 92 },
        { name: 'Tue', engagement: 78, attendance: 88 },
        { name: 'Wed', engagement: 82, attendance: 94 },
        { name: 'Thu', engagement: 90, attendance: 95 },
        { name: 'Fri', engagement: 88, attendance: 91 },
    ];

    const generateReport = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <div className="p-space max-w-[1400px] mx-auto">
            <header className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Intelligence Reports</h1>
                    <p className="text-[var(--secondary)] text-sm">Deep learning insights and automated academic performance audits.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" icon={Calendar}>
                        Last 30 Days
                    </Button>
                    <Button icon={Download} onClick={generateReport} loading={isGenerating}>
                        Export Analyst Report
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Summary Cards */}
                <EnterpriseCard title="Engagement Velocity" subtitle="Weekly engagement progression">
                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-3xl font-bold text-neutral-900">84.5%</span>
                        <span className="text-sm font-bold text-success-600 mb-1 flex items-center">
                            <TrendingUp size={16} className="mr-1" />
                            +2.4%
                        </span>
                    </div>
                    <div className="h-32 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorEngageReport" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="engagement" stroke="var(--primary-600)" strokeWidth={2} fill="url(#colorEngageReport)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </EnterpriseCard>

                <EnterpriseCard title="Risk Distribution" subtitle="At-risk student categorization">
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-success-500" />
                                <span className="text-sm font-medium text-neutral-600">Low Risk (Optimal)</span>
                            </div>
                            <span className="text-sm font-bold text-neutral-900">82%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-success-500 h-2 rounded-full" style={{ width: '82%' }} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-warning-500" />
                                <span className="text-sm font-medium text-neutral-600">Moderate Risk</span>
                            </div>
                            <span className="text-sm font-bold text-neutral-900">14%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-warning-500 h-2 rounded-full" style={{ width: '14%' }} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-error-500" />
                                <span className="text-sm font-medium text-neutral-600">Critical Risk</span>
                            </div>
                            <span className="text-sm font-bold text-neutral-900">4%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-error-500 h-2 rounded-full" style={{ width: '4%' }} />
                        </div>
                    </div>
                </EnterpriseCard>

                <EnterpriseCard title="Automated Advice" subtitle="AI-generated actionable items">
                    <div className="space-y-4 mt-2">
                        <div className="p-3 bg-primary-50 border border-primary-100 rounded-xl">
                            <div className="flex gap-3">
                                <AlertCircle className="text-primary-600 shrink-0" size={18} />
                                <div>
                                    <p className="text-xs font-bold text-primary-900 uppercase tracking-wide">Intervention</p>
                                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                                        3 students in Room 402 show consistent low engagement during morning sessions. Recommend schedule adjustment.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-success-50 border border-success-100 rounded-xl">
                            <div className="flex gap-3">
                                <CheckCircle className="text-success-600 shrink-0" size={18} />
                                <div>
                                    <p className="text-xs font-bold text-success-900 uppercase tracking-wide">Positive Trend</p>
                                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                                        Overall class participation has increased by 12% following the new interactive curriculum.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </EnterpriseCard>
            </div>

            {/* Detailed Reports Table */}
            <EnterpriseCard title="Generated Reports Archive" subtitle="Access historical analysis documents">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                        />
                    </div>
                    <Button variant="outline" icon={Filter}>Filter</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider pl-4">Report Name</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Type</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date Generated</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {[
                                { name: 'Weekly Engagement Analysis - Week 42', type: 'Automated', date: 'Oct 24, 2026', status: 'Ready' },
                                { name: 'Student Risk Assessment Report', type: 'Predictive', date: 'Oct 23, 2026', status: 'Ready' },
                                { name: 'Monthly Attendance Audit', type: 'Compliance', date: 'Oct 01, 2026', status: 'Archived' },
                                { name: 'Semester Performance Forecast', type: 'Forecast', date: 'Sep 15, 2026', status: 'Archived' },
                            ].map((report, i) => (
                                <tr key={i} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500 group-hover:bg-white group-hover:text-primary-600 transition-colors shadow-sm">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-neutral-900">{report.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-neutral-600">{report.type}</td>
                                    <td className="py-4 text-sm text-neutral-600">{report.date}</td>
                                    <td className="py-4">
                                        <Badge variant={report.status === 'Ready' ? 'success' : 'neutral'} dot>
                                            {report.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-right pr-4">
                                        <Button variant="ghost" size="sm" icon={Download} iconPosition="right">
                                            Download
                                        </Button>
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
