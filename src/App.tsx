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

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'store':
        return <StorePage />;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <CursorTrail />
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
      <AppContent />
    </CartProvider>
  );
}

export default App;
