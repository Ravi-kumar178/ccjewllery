import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-16 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
              <span className="text-5xl">🛒</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-charcoal/70 mb-8">
              Discover our exquisite collection and add items to your cart
            </p>
            <button
              onClick={() => onNavigate('store')}
              className="px-8 py-4 bg-gold text-white rounded-xl hover:bg-gold/90 transition-all inline-flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-2">
              Shopping Cart
            </h1>
            <p className="text-charcoal/70">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={() => onNavigate('store')}
            className="px-6 py-3 glass-card rounded-xl hover:glow-gold transition-all flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-6">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-serif font-semibold text-charcoal">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-2xl font-semibold text-gold mb-4">
                      ${item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 glass-card rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gold/10 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gold/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-lg font-medium text-charcoal">
                        Subtotal: ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-8 sticky top-28 animate-fade-in-up">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gold/20 pt-4">
                  <div className="flex justify-between text-xl font-semibold text-charcoal">
                    <span>Total</span>
                    <span className="text-gold">${(total * 1.08).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gold text-white rounded-xl hover:bg-gold/90 transition-all font-medium mb-4">
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full py-3 glass-card text-charcoal rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
              >
                Clear Cart
              </button>

              <div className="mt-6 p-4 bg-gold/5 rounded-xl text-sm text-charcoal/70">
                <p className="font-medium mb-2">Free Shipping</p>
                <p>On all orders. Delivered within 3-5 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
