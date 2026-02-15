import React, { useRef, useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/ui';
import {
    Camera,
    Activity,
    Eye,
    UserPlus,
    Search,
    Maximize2,
    Settings2,
    AlertTriangle
} from 'lucide-react';

export default function Monitoring() {
    const videoRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [detections, setDetections] = useState([]);
    const [logs, setLogs] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/attendance/logs");
                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.error("Log fetch error:", err);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval;
        if (isActive) {
            startCamera();
            interval = setInterval(processFrame, 1500);
        } else {
            stopCamera();
            setDetections([]);
        }
        return () => {
            stopCamera();
            clearInterval(interval);
        };
    }, [isActive]);

    const processFrame = async () => {
        if (!videoRef.current || !isActive) return;

        const video = videoRef.current;
        if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        try {
            const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.5));
            const fd = new FormData();
            fd.append('image', blob, 'frame.jpg');

            const res = await fetch('http://127.0.0.1:8000/api/v1/attendance/process-frame', {
                method: 'POST',
                body: fd
            });
            const data = await res.json();
            if (data.recognized_students) {
                setDetections(data.recognized_students);
            }
        } catch (err) {
            console.error("Frame processing error:", err);
        }
    };
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error(err);
            setIsActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };
    return (
        <div className="p-space max-w-[1400px] mx-auto h-full flex flex-col">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Live Monitoring Node</h1>
                    <p className="text-[var(--secondary)] text-sm">Real-time localized neural analysis for classroom session 402-B.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline"><Settings2 size={16} /></Button>
                    <Button
                        onClick={() => setIsActive(!isActive)}
                        className={isActive ? 'bg-white text-[var(--error)] border-[var(--error)] hover:bg-[#fef3f2]' : ''}
                    >
                        {isActive ? 'Terminate Stream' : 'Initialize Monitoring'}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <Card className="flex-1 min-h-[400px] relative bg-black flex items-center justify-center group overflow-hidden border-none rounded-2xl shadow-2xl">
                        {isActive ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90" />
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
                                    <Camera size={32} />
                                </div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Sensor Ready • Standby</p>
                            </div>
                        )}

                        {/* Minimal Overlay */}
                        {isActive && (
                            <div className="absolute inset-0 p-8 pointer-events-none flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--error)] animate-pulse" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">SECURE FEED_01</span>
                                    </div>
                                    <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-black/60 transition-colors pointer-events-auto">
                                        <Maximize2 size={16} />
                                    </button>
                                </div>

                                <div className="flex justify-center flex-col items-center gap-4">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">Processing Neural Latency: 12ms</span>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-3 gap-6">
                        <StatSmall label="Gaze Analysis" value="84.2%" status="Optimal" />
                        <StatSmall label="Posture Score" value="A+" status="Normal" />
                        <StatSmall label="Absense Rate" value="0%" status="Verified" />
                    </div>
                </div>

                <div className="flex flex-col gap-6 overflow-hidden">
                    <Card className="flex-1 flex flex-col min-h-0" title="Neural Monitoring">
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                            {/* Live Section */}
                            <div>
                                <h3 className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-4">Current Feed_01</h3>
                                <div className="space-y-3">
                                    {isActive && detections.length > 0 ? detections.map((studentId, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-[#f0f9ff] border border-[#b2ddff] rounded-xl transition-colors cursor-default">
                                            <div className="w-8 h-8 rounded-full bg-[#eff8ff] flex items-center justify-center text-[var(--primary)] font-bold text-[10px] border border-[#b2ddff]">
                                                {studentId.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-[var(--foreground)] truncate">{studentId}</p>
                                                <p className="text-[9px] text-[var(--primary)] font-bold">MATCHED</p>
                                            </div>
                                            <Badge status="success">LIVE</Badge>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] text-[var(--secondary)] text-center py-4 border border-dashed border-[var(--border)] rounded-xl uppercase tracking-widest">
                                            {isActive ? 'Scanning for identities...' : 'Stream inactive'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* History Section */}
                            <div>
                                <h3 className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-[0.2em] mb-4">Recent Node Events</h3>
                                <div className="space-y-3">
                                    {logs.slice(0, 5).map((log, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-[#f9fafb] rounded-lg transition-all opacity-80 hover:opacity-100">
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[9px]">
                                                {log.student_id?.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-700 truncate">{log.student_id}</p>
                                                <p className="text-[8px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                            </div>
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.engagement_score > 75 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>


                    <Card className="bg-[#fef3f2] border-[#fda29b] p-4">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-[#d92d20]" size={18} />
                            <div>
                                <p className="text-xs font-bold text-[#d92d20] uppercase tracking-wider">System Alert</p>
                                <p className="text-[#b42318] text-xs font-medium mt-0.5 leading-relaxed">2 anomalies detected in rear sector. Engagement metrics dropping.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const StatSmall = ({ label, value, status }) => (
    <Card className="p-4">
        <p className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <span className="text-[10px] font-bold text-[var(--success)]">{status}</span>
        </div>
    </Card>
);
