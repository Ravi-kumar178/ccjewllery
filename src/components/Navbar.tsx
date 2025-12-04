import { ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const[isAdmin,setIsAdmin] = useState(false);
  
  const location = useLocation();
  
  useEffect(()=>{
    if(location.pathname == '/admin/dashboard'){
      setIsAdmin(true);
    }
    else{
      setIsAdmin(false);
    }
  },[location?.pathname]);

  const navigate = useNavigate();


  const navLinks = [
    { name: 'Home', href: 'home' },
    { name: 'Collection', href: 'store' },
    { name: 'About', href: 'about' },
    // { name: 'Admin', href: 'admin' },
    { name: 'Contact', href: 'contact'}
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img
              src="/ccjewelers_logo.png"
              alt="Crystal Casting Jewelers"
              className="h-12 w-auto"
            />
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => {navigate("/");onNavigate(link.href)}}
                className={`text-xs font-normal tracking-widest uppercase transition-colors hover:text-gold ${
                  currentPage === link.href ? 'text-gold' : 'text-charcoal'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:text-gold transition-colors relative"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:text-gold transition-colors relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full text-white text-[10px] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gold/10 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gold/20 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => {
                  onNavigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === link.href
                    ? 'bg-gold/10 text-gold'
                    : 'hover:bg-gold/5 text-charcoal'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
