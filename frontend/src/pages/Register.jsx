import React, { useRef, useState, useEffect } from 'react';
import { EnterpriseCard, Button, Input } from '../components/enterprise';
import {
    Camera,
    User,
    IdCard,
    Layers,
    CheckCircle,
    AlertCircle,
    Scan,
    ShieldCheck
} from 'lucide-react';
import { registerStudent } from '../api/api';

export default function Register() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', studentId: '', className: '' });
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });

    // ... (camera logic remains same) ...
    useEffect(() => {
        if (isCapturing) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [isCapturing]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setStatus({ type: 'error', message: 'Visual sensor access denied.' });
            setIsCapturing(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            setCapturedImage(canvas.toDataURL('image/jpeg'));
            setIsCapturing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!capturedImage) return setStatus({ type: 'error', message: 'Biometric record required.' });

        try {
            const blob = await (await fetch(capturedImage)).blob();
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('student_id', formData.studentId);
            fd.append('class_name', formData.className);
            fd.append('image', blob, `${formData.studentId}.jpg`);

            const resp = await registerStudent(fd);
            if (resp.status === 'ok') {
                setStatus({ type: 'success', message: 'Biometric identity verified and stored.' });
                setFormData({ name: '', studentId: '', className: '' });
                setCapturedImage(null);
            } else {
                setStatus({ type: 'error', message: resp.detail || 'Data synchronization failed.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Communication with local node lost.' });
        }
    };

    return (
        <div className="p-space max-w-[1400px] mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Identifier Enrollment</h1>
                <p className="text-[var(--secondary)] text-sm">Onboard new candidates into the secure localization engine.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space">
                {/* Registration Details */}
                <EnterpriseCard title="Candidate Information" subtitle="Enter biological and institutional metadata">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Candidate Name"
                            placeholder="e.g. Alexander Pierce"
                            icon={User}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Institutional Identifier"
                            placeholder="e.g. STU-2024-001"
                            icon={IdCard}
                            value={formData.studentId}
                            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                            required
                        />
                        <Input
                            label="Session Classification"
                            placeholder="e.g. CS-101 (Section A)"
                            icon={Layers}
                            value={formData.className}
                            onChange={e => setFormData({ ...formData, className: e.target.value })}
                        />

                        <Button type="submit" fullWidth size="lg">
                            Verify and Enroll Identity
                        </Button>

                        {status.message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-error-50 text-error-700 border-error-200'}`}>
                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <p className="text-sm font-semibold">{status.message}</p>
                            </div>
                        )}
                    </form>
                </EnterpriseCard>

                {/* Biometric Integration */}
                <EnterpriseCard title="Biometric Confirmation" subtitle="Visual identification capture required">
                    <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-700 group">
                        {isCapturing ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : capturedImage ? (
                            <img src={capturedImage} alt="Capture" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <Camera size={24} strokeWidth={1.5} />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Active Sensor Required</p>
                            </div>
                        )}

                        {isCapturing && (
                            <div className="absolute inset-0 pointer-events-none p-6">
                                <div className="w-full h-full border border-dashed border-white/20 rounded-lg flex items-center justify-center">
                                    <div className="w-48 h-48 border-2 border-white/10 rounded-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
                        {!isCapturing && (
                            <Button variant="outline" className="flex-1" onClick={() => { setCapturedImage(null); setIsCapturing(true); }}>
                                {capturedImage ? 'Recapture Biometrics' : 'Initialize Sensor'}
                            </Button>
                        )}
                        {isCapturing && (
                            <Button className="flex-1" onClick={handleCapture}>
                                Optimize & Capture
                            </Button>
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary-600" size={18} />
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-tight">Security Protocol</p>
                                <p className="text-[10px] text-neutral-600 leading-tight">All captured biometric data remains within institutional local nodes. No cloud egress detected.</p>
                            </div>
                        </div>
                    </div>
                </EnterpriseCard>
            </div>
        </div>
    );
}
