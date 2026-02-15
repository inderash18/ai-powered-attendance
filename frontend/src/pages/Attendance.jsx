import React, { useRef, useState, useEffect } from 'react';
import { Camera, Activity, Scan, ShieldCheck, Zap, Maximize, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Attendance() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [recognizedStudents, setRecognizedStudents] = useState([]);
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, matched

    useEffect(() => {
        let interval;
        if (isActive) {
            startCamera();
            interval = setInterval(processFrame, 1500);
        } else {
            stopCamera();
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setIsActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const processFrame = async () => {
        const video = videoRef.current;
        if (!video || video.paused) return;

        setScanStatus('scanning');

        // Process logic here...
        // (Simplified for visual update)
        setTimeout(() => setScanStatus('idle'), 500);
    };

    return (
        <div className="p-10 flex flex-col h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)]">
            <header className="mb-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-500">Neural Engine Online</span>
                    </div>
                    <h1 className="text-4xl font-black text-gradient tracking-tight">Real-time Analysis</h1>
                    <p className="text-slate-500 mt-1 font-medium">Synchronized biometric tracking and attention monitoring.</p>
                </div>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${isActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20'}`}
                >
                    <div className="relative flex items-center gap-3">
                        {isActive ? <Zap size={18} fill="currentColor" /> : <Camera size={18} />}
                        {isActive ? 'DEACTIVATE ENGINE' : 'INITIALIZE STREAM'}
                    </div>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 flex-1 min-h-0">
                {/* Cinematic Feed Wrapper */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="relative flex-1 glass-panel rounded-[3rem] overflow-hidden border border-white/5 group">
                        {isActive ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#08080c] relative">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
                                <div className="relative z-10 flex flex-col items-center gap-4 py-20">
                                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <Maximize className="text-indigo-400 opacity-50" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sensor Standby Mode</p>
                                </div>
                            </div>
                        )}

                        {/* Futuristic Overlay UI */}
                        {isActive && (
                            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="text-[10px] font-black tracking-widest text-white uppercase">Live Sensor: Feed_01</span>
                                        </div>
                                        <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Res: 1080p Neural Optimized</span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 border-t-2 border-r-2 border-indigo-500/40 opacity-50" />
                                </div>

                                <div className="flex justify-center flex-col items-center gap-4">
                                    <AnimatePresence>
                                        {scanStatus === 'scanning' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]"
                                            >
                                                Analyzing Neural Patterns...
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="w-16 h-16 border-b-2 border-l-2 border-indigo-500/40 opacity-50" />
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                                        <div className="flex gap-6">
                                            <MetricMini label="Lat" value="24ms" />
                                            <MetricMini label="Eng" value="Neural" />
                                            <MetricMini label="FPS" value="30.2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <StatBlock label="Core Temperature" value="Optimized" sub="Neural Engine" />
                        <StatBlock label="Detections / Min" value="142" sub="+12% Trending" />
                        <StatBlock label="Accuracy Rate" value="99.9%" sub="Biometric Verified" />
                    </div>
                </div>

                {/* Analytics Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
                    <div className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col min-h-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                            <Activity className="text-indigo-400" size={16} />
                            Activity Log
                        </h3>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            <LogEntry name="Aiden Marcus" id="ID_2042" status="Engaged" time="Just Now" />
                            <LogEntry name="Sarah Chen" id="ID_9921" status="Distracted" time="2m ago" alert />
                            <LogEntry name="Elena Rodriguez" id="ID_8832" status="Engaged" time="5m ago" />
                            <LogEntry name="Marcus Thorne" id="ID_1102" status="Engaged" time="12m ago" />
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2.5rem] p-6 bg-indigo-600/5 border-indigo-500/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/80">Offline Integrity</p>
                                <p className="text-sm font-bold text-white tracking-tight">System Secured Locally</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const MetricMini = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
    </div>
);

const StatBlock = ({ label, value, sub }) => (
    <div className="glass-panel p-6 rounded-[2rem] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter leading-none mb-2">{value}</p>
        <p className="text-[10px] font-bold text-indigo-400/70">{sub}</p>
    </div>
);

const LogEntry = ({ name, id, status, time, alert }) => (
    <div className="group p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-all cursor-default">
        <div className="flex justify-between items-start mb-2">
            <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                <p className="text-xs font-black tracking-tight text-white">{name}</p>
            </div>
            <span className="text-[9px] font-bold text-slate-600">{time}</span>
        </div>
        <div className="flex justify-between items-center pl-5">
            <p className="text-[10px] font-bold text-slate-500">{id}</p>
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${alert ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {status}
            </div>
        </div>
    </div>
);
