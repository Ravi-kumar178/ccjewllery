import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { postMethod, getMethod } from '../api/api';
import toast from 'react-hot-toast';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'AUTHORIZE_NET'>('COD');
  const [cartId, setCartId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
  });

  const [cardData, setCardData] = useState({
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces (XXXX XXXX XXXX XXXX)
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.replace(/\s/g, '').length <= 16) {
        setCardData(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'cardExpiry') {
      // Format expiry as MM/YY
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 4) {
        const formattedExpiry = formatted.match(/.{1,2}/g)?.join('/') || formatted;
        setCardData(prev => ({ ...prev, [name]: formattedExpiry }));
      }
    } else if (name === 'cardCVV') {
      // Limit CVV to 3-4 digits
      if (value.replace(/\D/g, '').length <= 4) {
        setCardData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
      }
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Helper function to check if string is a valid MongoDB ObjectId
  const isValidObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Helper function to ensure product exists in backend and get its ObjectId
  const ensureProductInBackend = async (item: any): Promise<string | null> => {
    // If already a valid ObjectId, return it
    if (isValidObjectId(item.id)) {
      return item.id;
    }

    // Try to find product by name in backend
    try {
      const products = await getMethod({ url: '/product/list' });
      if (products?.success && products?.product && Array.isArray(products.product)) {
        const existingProduct = products.product.find((p: any) => 
          p.name && p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );
        if (existingProduct && existingProduct._id) {
          return existingProduct._id.toString();
        }
      }
    } catch (error) {
      console.error('Error checking backend products:', error);
    }

    return null;
  };

  const createCartAndAddItems = async () => {
    try {
      // Create cart
      const cartResponse = await postMethod({ url: '/cart/create', body: {} });
      if (!cartResponse.success) {
        throw new Error('Failed to create cart');
      }
      
      const newCartId = cartResponse.cartId;
      setCartId(newCartId);

      // Add all items to cart
      const addItemResults = await Promise.all(
        items.map(async (item) => {
          try {
            const productId = await ensureProductInBackend(item);
            
            if (!productId) {
              return { 
                success: false, 
                item: item.name, 
                error: `Product "${item.name}" not found in backend.` 
              };
            }

            const response = await postMethod({
              url: '/cart/add',
              body: {
                cartId: newCartId,
                productId: productId,
                quantity: item.quantity,
              }
            });
            
            return { success: response.success, item: item.name, error: response.message };
          } catch (error: any) {
            console.error(`Error adding item ${item.id}:`, error);
            return { success: false, item: item.name, error: error.message };
          }
        })
      );

      const successfulAdds = addItemResults.filter(r => r.success);
      if (successfulAdds.length === 0) {
        throw new Error('Failed to add items to cart. Products may not exist in backend.');
      }

      return newCartId;
    } catch (error: any) {
      console.error('Error creating cart:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create cart');
    }
  };

  const handlePlaceOrder = async () => {
    // Validate form fields
    for (const key in formData) {
      // @ts-ignore
      if (!formData[key]?.trim()) {
        setError("Please fill all required fields.");
        return;
      }
    }

    // Validate card fields if Authorize.Net is selected
    if (paymentMethod === 'AUTHORIZE_NET') {
      if (!cardData.cardNumber.replace(/\s/g, '') || !cardData.cardExpiry || !cardData.cardCVV) {
        setError("Please fill all card details.");
        return;
      }
      
      if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardData.cardExpiry)) {
        setError("Please enter card expiry in MM/YY format.");
        return;
      }

      if (cardData.cardCVV.length < 3) {
        setError("Please enter a valid CVV.");
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      // Create cart and add items if not already done
      let finalCartId = cartId;
      if (!finalCartId) {
        finalCartId = await createCartAndAddItems();
      }

      const orderData = {
        cartId: finalCartId,
        amount: total * 1.08, // Including tax
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip,
        country: formData.country,
        phone: formData.phone,
      };

      let response;
      if (paymentMethod === 'COD') {
        response = await postMethod({
          url: '/order/place',
          body: orderData
        });
      } else {
        response = await postMethod({
          url: '/order/authnet',
          body: {
            ...orderData,
            cardNumber: cardData.cardNumber.replace(/\s/g, ''),
            cardExpiry: cardData.cardExpiry,
            cardCVV: cardData.cardCVV,
          }
        });
      }

      if (response.success) {
        toast.success(response.message || 'Order placed successfully!');
        clearCart();
        setShowCheckoutForm(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          phone: "",
        });
        setCardData({
          cardNumber: "",
          cardExpiry: "",
          cardCVV: "",
        });
        setCartId(null);
      } else {
        setError(response.message || 'Failed to place order');
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while placing your order';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      await createCartAndAddItems();
      setShowCheckoutForm(true);
    } catch (error: any) {
      console.error('Error proceeding to checkout:', error);
      setError('Failed to proceed to checkout. Please try again.');
      toast.error('Failed to proceed to checkout');
    } finally {
      setLoading(false);
    }
  };



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
        
        {/* HEADER */}
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

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE — CART ITEMS or CHECKOUT FORM */}
          <div className="lg:col-span-2 space-y-4">

            {/* IF NOT CHECKOUT → SHOW CART ITEMS */}
            {!showCheckoutForm && items.map((item, index) => (
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

            {/* IF CHECKOUT → SHOW FORM */}
            {showCheckoutForm && (
              <div className="glass-card rounded-2xl p-8 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-serif font-bold text-charcoal">
                    Checkout Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowCheckoutForm(false);
                      setError("");
                    }}
                    className="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                  >
                    ← Back to Cart
                  </button>
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'COD'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <Wallet className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold text-charcoal">Cash on Delivery</div>
                        <div className="text-xs text-charcoal/60">Pay when you receive</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AUTHORIZE_NET')}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'AUTHORIZE_NET'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold text-charcoal">Authorize.Net</div>
                        <div className="text-xs text-charcoal/60">Secure payment</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* FORM STATE */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                  {/** FIRST NAME */}
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="First Name"
                  />

                  {/** LAST NAME */}
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="Last Name"
                  />

                  {/** EMAIL */}
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input md:col-span-2 border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="Email Address"
                  />

                  {/** STREET */}
                  <input
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input md:col-span-2 border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="Street"
                  />

                  {/** CITY */}
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="City"
                  />

                  {/** STATE */}
                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="State"
                  />

                  {/** ZIP */}
                  <input
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="ZIP Code"
                  />

                  {/** COUNTRY */}
                  <input
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="Country"
                  />

                  {/** PHONE */}
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input md:col-span-2 border border-gold py-1.5 px-4 rounded-lg"
                    placeholder="Phone Number"
                  />

                  {/* CARD FIELDS - Only show if Authorize.Net is selected */}
                  {paymentMethod === 'AUTHORIZE_NET' && (
                    <>
                      <div className="md:col-span-2 border-t border-gold/20 pt-4 mt-2">
                        <h3 className="text-lg font-semibold text-charcoal mb-4">Card Details</h3>
                      </div>
                      
                      <input
                        required
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        className="input md:col-span-2 border border-gold py-1.5 px-4 rounded-lg"
                        placeholder="Card Number (e.g., 4111 1111 1111 1111)"
                        maxLength={19}
                      />

                      <input
                        required
                        name="cardExpiry"
                        value={cardData.cardExpiry}
                        onChange={handleCardChange}
                        className="input border border-gold py-1.5 px-4 rounded-lg"
                        placeholder="MM/YY"
                        maxLength={5}
                      />

                      <input
                        required
                        name="cardCVV"
                        value={cardData.cardCVV}
                        onChange={handleCardChange}
                        className="input border border-gold py-1.5 px-4 rounded-lg"
                        placeholder="CVV"
                        maxLength={4}
                        type="password"
                      />

                      <div className="md:col-span-2 p-3 bg-gold/5 rounded-lg text-xs text-charcoal/70">
                        <p className="font-medium mb-1">Test Cards (Sandbox Mode):</p>
                        <p>• Approved: 4111 1111 1111 1111</p>
                        <p>• Declined: 4222 2222 2222 2220</p>
                        <p>• CVV: Any 3 digits | Expiry: Any future date (MM/YY)</p>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}


          </div>

          {/* RIGHT SIDE — ORDER SUMMARY */}
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

              {/* BUTTON CHANGES TEXT */}
              <button
                onClick={() => {
                  if (!showCheckoutForm) {
                    handleProceedToCheckout();
                  } else {
                    handlePlaceOrder();
                  }
                }}
                disabled={loading}
                className="w-full py-4 bg-gold text-white rounded-xl hover:bg-gold/90 transition-all font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading 
                  ? "Processing..." 
                  : showCheckoutForm 
                    ? `Place Order (${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Authorize.Net'})` 
                    : "Proceed to Checkout"
                }
              </button>
              {error && (
                <p className="text-red-600 text-sm mb-3 text-center">
                  {error}
                </p>
              )}

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
