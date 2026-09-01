import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import GoogleCallback from './Components/GoogleCallback';
import UserDashboard from './user/UserDashboard';
import Userjobs from './user/UserJobs';
import Aimatch from './user/Aimatch';
import ResumeAnalyzer from './user/ResumeAnalyzer';

import UserContanct from './user/UserContanct';
import UserProfile from './user/UserProfile';
import Dashboard from './Page/Dashboard';
import Admin from './admin/Admin';

import Hrhome from './HR Page/Hrhome';
import HRPage from './HR Page/HRPage';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Dashboard  />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        
        <Route path="/hr" element={<HRPage />} />
        <Route path="/hrhome" element={<Hrhome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contanct" element={<UserContanct/>}/>
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/jobs" element={<Userjobs />} />
        <Route path="/match" element={<Aimatch/>} />
        <Route path="/resume" element={<ResumeAnalyzer/>} />
        <Route path="/profile" element={<UserProfile/>}/>
      </Routes>   
    </>
  )
}

export default App
