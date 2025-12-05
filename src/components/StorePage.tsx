import { useEffect, useState } from 'react';
import { Search, X, ShoppingCart, Heart, Share2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { useCart } from '../contexts/CartContext';
import Footer from './Footer';
import { /* allProducts, */ categories, Product } from '../data/products';
import { getMethod } from '../api/api';

interface StorePageProps {
  onNavigate: (page: string) => void;
}

export default function StorePage({ onNavigate }: StorePageProps) {

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getMethod({ url: "/product/list" });
        setAllProducts(data?.product);  

      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: 'all',
  });

  const filteredProducts = allProducts.filter(product => {
    if (filters?.search && !product?.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'under100' && product?.price >= 100) return false;
      if (filters.priceRange === '100-500' && (product?.price < 100 || product?.price >= 500)) return false;
      if (filters.priceRange === '500-1000' && (product?.price < 500 || product?.price >= 1000)) return false;
      if (filters.priceRange === '1000-2000' && (product?.price < 1000 || product?.price >= 2000)) return false;
      if (filters.priceRange === 'over2000' && product?.price < 2000) return false;
    }

    return true;
  });

  return (
    <>
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-charcoal mb-2 tracking-wide">
            Our Collection
          </h1>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            Discover Timeless Pieces Crafted for Elegance
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search for jewelry..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal/10 focus:outline-none focus:border-gold text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-12">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 bg-white border border-charcoal/10 focus:outline-none focus:border-gold text-xs uppercase tracking-wider"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="px-4 py-2 bg-white border border-charcoal/10 focus:outline-none focus:border-gold text-xs uppercase tracking-wider"
          >
            <option value="all">All Prices</option>
            <option value="under100">Under $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="over2000">Over $2,000</option>
          </select>
        </div>

        <div className="mb-8 text-xs text-charcoal/60">
          Showing {filteredProducts.length} of {allProducts.length} products
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal/60 uppercase tracking-wider">No products found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
    <Footer onNavigate={onNavigate}/>
    </>
  );
}

function ProductQuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white hover:bg-gold hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col">
            {product.stone_type && (
              <div className="mb-4">
                <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-normal uppercase tracking-wider">
                  {product.stone_type}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-serif font-light text-charcoal mb-2 tracking-wide">
              {product.name}
            </h2>

            <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-4">
              {product.category}
            </p>

            <p className="text-3xl font-light text-gold mb-6">
              ${product.price.toLocaleString()}
            </p>

            <p className="text-sm text-charcoal/70 mb-6 leading-relaxed">
              {product.description}
            </p>

            {(product.style || product.occasion) && (
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                {product.style && (
                  <div className="bg-pearl/20 p-3">
                    <p className="text-charcoal/50 mb-1 uppercase tracking-wider">Style</p>
                    <p className="font-light text-charcoal">{product.style}</p>
                  </div>
                )}
                {product.occasion && (
                  <div className="bg-pearl/20 p-3">
                    <p className="text-charcoal/50 mb-1 uppercase tracking-wider">Occasion</p>
                    <p className="font-light text-charcoal">{product.occasion}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-gold text-white hover:bg-gold/90 transition-all flex items-center justify-center gap-2 text-xs font-normal uppercase tracking-wider"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => {}}
                className="p-3 bg-pearl/30 hover:bg-gold/10 transition-all"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-3 bg-pearl/30 hover:bg-gold/10 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {showSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs text-center animate-fade-in-up uppercase tracking-wider">
                Added to cart successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
