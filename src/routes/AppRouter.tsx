import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import AttendancePage from '../features/attendance/pages/AttendancePage';
import LoginPage from '../features/auth/pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import AlumnoProfilePage from '../features/alumnos/pages/AlumnoProfilePage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clase/:claseId/asistencias" 
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumnos/:dni" 
          element={
            <ProtectedRoute>
              <AlumnoProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};