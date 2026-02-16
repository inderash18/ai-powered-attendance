import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';

// Pages
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Students from './pages/Students';
import Register from './pages/Register';

import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollment" element={<Register />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Shell>
    </Router>
  );
}
