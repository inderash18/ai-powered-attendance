import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    UserX,
    History,
    Download
} from 'lucide-react';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/students");
                const data = await res.json();
                setStudents(data);
            } catch (err) {
                console.error("Failed to fetch students:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="p-space max-w-[1400px] mx-auto">
            <header className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Student Directory</h1>
                    <p className="text-[var(--secondary)] text-sm">Manage student identifiers, enrollment status, and biometric records.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2" size={16} />
                        CVS Export
                    </Button>
                    <Button>
                        <Plus className="mr-2" size={16} />
                        Register Student
                    </Button>
                </div>
            </header>

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            className="w-full bg-[#f9fafb] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-sm font-medium h-fit">
                            <Filter className="mr-2" size={16} />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#eaecf0]">
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Candidate Identifier</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Academic Placement</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Institutional Email</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Audit Status</th>
                                <th className="pb-4 text-xs font-bold text-[var(--secondary)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaecf0]">
                            {students.length > 0 ? students.map((student, i) => (
                                <tr key={i} className="group hover:bg-[#f9fafb] transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#f2f4f7] border border-[#eaecf0] flex items-center justify-center font-bold text-xs text-[#344054]">
                                                {student.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{student.name}</p>
                                                <p className="text-[10px] font-medium text-[var(--secondary)]">{student.student_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-sm font-medium text-[var(--secondary)]">{student.class || 'General'}</p>
                                        <p className="text-[10px] text-[#98a2b3]">Enrollment: {student.enrollment || '2024'}</p>
                                    </td>
                                    <td className="py-4 text-sm font-medium text-[var(--secondary)]">{student.email || `${student.student_id?.toLowerCase()}@univ.edu`}</td>
                                    <td className="py-4">
                                        <Badge status={student.status === 'Active' ? 'success' : student.status === 'Risk' ? 'error' : 'success'}>
                                            {student.status || 'Active'}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-2 text-[var(--secondary)] hover:bg-white hover:text-[var(--primary)] rounded-lg transition-all border border-transparent hover:border-[#eaecf0]"><History size={16} /></button>
                                            <button className="p-2 text-[var(--secondary)] hover:bg-white hover:text-[var(--primary)] rounded-lg transition-all border border-transparent hover:border-[#eaecf0]"><Mail size={16} /></button>
                                            <button className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all border border-transparent hover:border-rose-100"><UserX size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-[var(--secondary)] text-sm">
                                        {isLoading ? 'Loading students...' : 'No students registered in the database.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
