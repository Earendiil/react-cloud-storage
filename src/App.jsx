import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/SignupPage';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './routes/ProtextedRoute';
import ChangePasswordPage from './pages/ChangePasswordPage';


function App() {
  return (
  <> 
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Router>
    <ToastContainer/>
  </>
  );
}

export default App;