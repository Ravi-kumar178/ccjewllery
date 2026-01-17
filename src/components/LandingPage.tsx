import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Footer from './Footer';
 //import { allProducts } from '../data/products';
import { getMethod } from '../api/api';
import { Product } from '../data/products';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getMethod({ url: "/product/list" });
        
        // Map backend products to frontend Product interface
        if (data?.success && data?.product && Array.isArray(data.product)) {
          const mappedProducts: Product[] = data.product.map((p: any) => ({
            id: p._id ? p._id.toString() : '', // Convert MongoDB _id to string
            name: p.name || '',
            description: p.description || '',
            price: p.price || 0,
            category: p.category || '',
            image_url: p.image && Array.isArray(p.image) && p.image.length > 0 
              ? p.image 
              : 'https://via.placeholder.com/400', // Fallback image
            stock_count: 10, // Default
            in_stock: true,
            stone_type: p.stone_type || p.subCategory || undefined,
            style: p.style,
            occasion: p.occasion,
          }));
          setAllProducts(mappedProducts);
        } else {
          console.warn('No products found in backend response');
          setAllProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        setAllProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = allProducts?.slice(0, 12) || [];
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection onNavigate={onNavigate} scrollY={scrollY} />
      <ShowcaseCarousel products={featuredProducts} onNavigate={onNavigate} />
      <BrandPromiseSection />
      <TestimonialsSection />
      <Footer onNavigate={onNavigate}/>
    </div>
  );
}

function HeroSection({ onNavigate, scrollY }: { onNavigate: (page: string) => void; scrollY: number }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-white"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      >
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(201, 169, 97, 0.05) 0%, transparent 60%),
                           radial-gradient(circle at 70% 70%, rgba(80, 200, 120, 0.03) 0%, transparent 60%)`,
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="animate-fade-in-up">
          <img
            src="/ccjewelers_logo.png"
            alt="Crystal Casting Jewelers"
            className="h-24 md:h-28 w-auto mx-auto mb-8 opacity-90"
          />

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-charcoal leading-tight mb-6 tracking-wide">
            Timeless Elegance,
            <br />
            <span className="font-normal text-gold">Handcrafted Perfection</span>
          </h1>

          <p className="text-base md:text-lg text-charcoal/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Discover exquisite jewelry where artistry meets sophistication.
            <br className="hidden md:block" />
            Each piece tells a unique story of craftsmanship and timeless beauty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('store')}
              className="px-10 py-3 bg-gold text-white rounded-sm hover:bg-gold/90 transition-all text-sm font-normal tracking-wider uppercase shadow-sm hover:shadow-md"
            >
              Explore Collection
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('featured-collection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-3 border border-charcoal/20 text-charcoal rounded-sm hover:border-gold hover:text-gold transition-all text-sm font-normal tracking-wider uppercase"
            >
              View Featured
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border border-charcoal/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gold/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function ShowcaseCarousel({ products, onNavigate }: { products: Product[]; onNavigate: (page: string) => void }) {
  
  return (
    <section id="featured-collection" className="py-20 px-6 bg-gradient-to-b from-white to-pearl/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal mb-3 tracking-wide">
            Featured Collection
          </h2>
          <p className="text-sm text-charcoal/50 uppercase tracking-widest">
            Handcrafted Excellence
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal/60 uppercase tracking-wider">
              No products available at the moment
            </p>
            <p className="text-xs text-charcoal/40 mt-2">
              Please add products via Admin Dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...products].reverse().slice(0, 8).map((product, index) => (
              <div
                key={product.id || index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} onViewDetails={() => onNavigate('store')} />
              </div>
            ))}
          </div>
        )}

        {
          products.length > 8 && (
            <div className="text-center mt-12">
              <button
                onClick={() => onNavigate('store')}
                className="px-8 py-2.5 border border-charcoal/20 text-charcoal rounded-sm hover:border-gold hover:text-gold transition-all text-xs font-normal tracking-widest uppercase"
              >
                View All
              </button>
            </div>
          )
        }
      </div>
    </section>
  );
}

function BrandPromiseSection() {
  const promises = [
    {
      title: 'Ethically Sourced',
      description: 'Every gemstone is traceable and responsibly mined',
    },
    {
      title: 'Master Crafted',
      description: 'Decades of expertise in every piece',
    },
    {
      title: 'Lifetime Guarantee',
      description: 'Your investment is protected forever',
    },
    {
      title: 'Complimentary Service',
      description: 'Free cleaning and inspection for life',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-charcoal mb-3 tracking-wide">
            The Crystal Casting Promise
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            Quality You Can Trust
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 mx-auto mb-4 border border-gold/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
              </div>
              <h3 className="text-sm font-serif font-normal text-charcoal mb-2">
                {promise.title}
              </h3>
              <p className="text-xs text-charcoal/50 leading-relaxed font-light">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      text: 'The Diamond Eternity Bracelet is absolutely stunning. The craftsmanship is impeccable, and it sparkles beautifully in any light.',
      rating: 5,
    },
    {
      name: 'Emily Chen',
      text: 'I purchased the Rose Gold Pearl Cuff for my wedding, and it was perfect. The quality exceeded my expectations.',
      rating: 5,
    },
    {
      name: 'Jessica Taylor',
      text: 'Crystal Casting creates true works of art. Every piece I own has become a treasured heirloom.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-6 bg-pearl/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-charcoal mb-2 tracking-wide">
            Client Testimonials
          </h2>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">
            Trusted by Thousands
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-charcoal/5 p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-xs text-charcoal/70 mb-5 leading-relaxed font-light italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-charcoal/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-champagne/20" />
                <div>
                  <p className="text-xs font-normal text-charcoal">{testimonial.name}</p>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Verified</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

