import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StorePage from './components/StorePage';
import CartPage from './components/CartPage';
import AdminDashboard from './components/AdminDashboard';
import AboutPage from './components/AboutPage';
import ParticleBackground from './components/ParticleBackground';
import CursorTrail from './components/CursorTrail';
import ContactPage from './components/ContactPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage}/>;
      case 'store':
        return <StorePage onNavigate={setCurrentPage}/>;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      // case 'admin':
      //   return <AdminDashboard />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage}/>
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* <ParticleBackground />
      <CursorTrail /> */}
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="relative z-10">
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Toaster position='top-right'/>
      <Router>
        <ParticleBackground />
        <CursorTrail />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          {/* Protected Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path='/*' element={<AppContent/>}/>
        </Routes>
      </Router>
      {/* <AppContent /> */}
    </CartProvider>
  );
}

export default App;
