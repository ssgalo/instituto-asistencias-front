// src/routes/AppRouter.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import AttendancePage from '../features/attendance/pages/AttendancePage';
// Próximamente importaremos LoginPage y AttendancePage

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clase/:claseId/asistencias" element={<AttendancePage />} />
      </Routes>
    </BrowserRouter>
  );
};