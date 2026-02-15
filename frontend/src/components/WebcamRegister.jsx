import React, { useRef, useState } from "react";
import { registerStudent } from "../api/api";

export default function WebcamRegister() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }

  async function captureAndSend(e) {
    e.preventDefault();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg"));
    const fd = new FormData();
    fd.append("name", name);
    fd.append("student_id", studentId);
    fd.append("image", blob, `${studentId}.jpg`);
    const resp = await registerStudent(fd);
    alert(JSON.stringify(resp));
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Register Student</h2>
      <video ref={videoRef} className="w-full h-64 bg-black mb-2" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="flex gap-2 mb-2">
        <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 w-36" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={startCamera}>Start Camera</button>
        <button className="btn" onClick={captureAndSend}>Capture & Register</button>
      </div>
    </div>
  );
}
