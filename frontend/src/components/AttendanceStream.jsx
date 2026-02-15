import React, { useEffect, useState } from "react";

export default function AttendanceStream() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/attendance");
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setEvents((s) => [data, ...s].slice(0, 30));
      } catch {}
    };
    return () => ws.close();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Live Attendance</h2>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {events.map((e, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{e.student_id} — {e.name}</span>
            <span className="text-sm text-gray-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
