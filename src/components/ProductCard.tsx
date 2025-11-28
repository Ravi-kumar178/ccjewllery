import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stone_type?: string;
  };
  onViewDetails: () => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <div
      className="group relative bg-white border border-charcoal/5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onViewDetails}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-pearl/30">
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 bg-white text-charcoal rounded-sm hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-normal uppercase tracking-wider"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 bg-white text-charcoal rounded-sm hover:bg-gold hover:text-white transition-all"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {product.stone_type && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-charcoal text-[10px] font-normal rounded-sm uppercase tracking-wider">
              {product.stone_type}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-serif font-normal text-charcoal mb-1 group-hover:text-gold transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base font-light text-gold">
          ${product.price.toLocaleString()}
        </p>
      </div>

      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors pointer-events-none" />
    </div>
  );
}
