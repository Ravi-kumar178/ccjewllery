import { Facebook, Instagram } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-serif font-normal mb-4 tracking-wide">Crystal Casting</h3>
            <p className="text-white/60 text-xs font-light leading-relaxed">
              Luxury jewelry crafted with passion and precision since 2010.
            </p>
            {/* Add social media icon */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.instagram.com/ccjeweler/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61579016267257"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

          </div>

          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li className="hover:text-gold transition-colors cursor-pointer">Bracelets</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Necklaces</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Earrings</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Rings</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li
              onClick={() => {onNavigate("about");window.scrollTo(0,0);}}
              className="hover:text-gold transition-colors cursor-pointer">About Us</li>
              <li 
              onClick={() => {onNavigate("contact");window.scrollTo(0,0)}}
              className="hover:text-gold transition-colors cursor-pointer">Contact</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Sustainability</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Craftsmanship</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-normal mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li className="hover:text-gold transition-colors cursor-pointer">FAQ</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Shipping</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Returns</li>
              <li className="hover:text-gold transition-colors cursor-pointer">Care Guide</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-xs text-white/50 font-light">
          <p>&copy; 2024 Crystal Casting Jewelers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
