import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Wallet, Smartphone, Zap } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { postMethod, getMethod } from '../api/api';
import toast from 'react-hot-toast';
import '../types/razorpay.d.ts';

// Declare Stripe types
declare global {
  interface Window {
    Stripe?: any;
  }
}

interface CartPageProps {
  onNavigate: (page: string) => void;
}

// Helper function to convert country name to ISO 3166-1 alpha-2 code
const getCountryCode = (countryName: string): string => {
  if (!countryName) return 'US'; // Default to US if empty
  
  // Convert to lowercase for case-insensitive matching
  const country = countryName.trim().toLowerCase();
  
  // Common country name to ISO code mapping
  const countryMap: { [key: string]: string } = {
    'india': 'IN',
    'united states': 'US',
    'usa': 'US',
    'united states of america': 'US',
    'united kingdom': 'GB',
    'uk': 'GB',
    'canada': 'CA',
    'australia': 'AU',
    'germany': 'DE',
    'france': 'FR',
    'italy': 'IT',
    'spain': 'ES',
    'japan': 'JP',
    'china': 'CN',
    'brazil': 'BR',
    'mexico': 'MX',
    'russia': 'RU',
    'south korea': 'KR',
    'netherlands': 'NL',
    'belgium': 'BE',
    'switzerland': 'CH',
    'austria': 'AT',
    'sweden': 'SE',
    'norway': 'NO',
    'denmark': 'DK',
    'finland': 'FI',
    'poland': 'PL',
    'portugal': 'PT',
    'greece': 'GR',
    'turkey': 'TR',
    'saudi arabia': 'SA',
    'uae': 'AE',
    'united arab emirates': 'AE',
    'singapore': 'SG',
    'malaysia': 'MY',
    'thailand': 'TH',
    'indonesia': 'ID',
    'philippines': 'PH',
    'vietnam': 'VN',
    'south africa': 'ZA',
    'egypt': 'EG',
    'israel': 'IL',
    'new zealand': 'NZ',
    'argentina': 'AR',
    'chile': 'CL',
    'colombia': 'CO',
    'peru': 'PE',
    'bangladesh': 'BD',
    'pakistan': 'PK',
    'sri lanka': 'LK',
    'nepal': 'NP',
  };
  
  // Check if it's already a 2-character code
  if (country.length === 2 && /^[A-Za-z]{2}$/.test(country)) {
    return country.toUpperCase();
  }
  
  // Look up in map
  const code = countryMap[country];
  if (code) {
    return code;
  }
  
  // If not found, try to extract first 2 letters (fallback)
  // But better to return US as default for Stripe compatibility
  console.warn(`Country "${countryName}" not found in mapping, defaulting to US`);
  return 'US';
};

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'AUTHORIZE_NET' | 'RAZORPAY' | 'STRIPE'>('COD');
  const [cartId, setCartId] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeElements, setStripeElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

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

  // Check if Stripe.js is loaded and initialize Elements
  useEffect(() => {
    const checkStripe = () => {
      if (typeof window.Stripe !== 'undefined') {
        setStripeLoaded(true);
        const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (STRIPE_PUBLISHABLE_KEY) {
          const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
          const elements = stripe.elements();
          setStripeElements({ stripe, elements });
          
          // Create card element when Elements is ready
          const cardElement = elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#2c2c2c',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#dc2626',
                iconColor: '#dc2626',
              },
            },
          });
          
          // Handle real-time validation errors
          cardElement.on('change', ({error}: any) => {
            const displayError = document.getElementById('stripe-card-errors');
            if (displayError) {
              displayError.textContent = error ? error.message : '';
            }
          });
          
          setCardElement(cardElement);
        }
      } else {
        // Retry after a short delay
        setTimeout(checkStripe, 100);
      }
    };
    checkStripe();
  }, []);

  // Mount Stripe card element when it's ready and payment method is Stripe
  useEffect(() => {
    if (cardElement && stripeElements && paymentMethod === 'STRIPE' && showCheckoutForm) {
      const cardElementContainer = document.getElementById('stripe-card-element');
      if (cardElementContainer && !cardElementContainer.hasChildNodes()) {
        cardElement.mount('#stripe-card-element');
      }
      
      return () => {
        if (cardElementContainer && cardElementContainer.hasChildNodes()) {
          cardElement.unmount();
        }
      };
    }
  }, [cardElement, stripeElements, paymentMethod, showCheckoutForm]);

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

    // Validate card fields if Authorize.Net or Stripe is selected
    if (paymentMethod === 'AUTHORIZE_NET' || paymentMethod === 'STRIPE') {
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

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    // Validate form fields
    for (const key in formData) {
      // @ts-ignore
      if (!formData[key]?.trim()) {
        setError("Please fill all required fields.");
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

      // Step 1: Create Razorpay order on backend
      const orderResponse = await postMethod({
        url: '/order/razorpay',
        body: {
          cartId: finalCartId,
          amount: Math.round(total * 1.08 * 100), // Amount in paise
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          country: formData.country,
          phone: formData.phone
        }
      });

      if (!orderResponse.success) {
        setError(orderResponse.message || 'Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Razorpay Order created:', orderResponse);

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.razorpayOrder.amount,
        currency: orderResponse.razorpayOrder.currency || 'INR',
        order_id: orderResponse.razorpayOrder.id,
        name: 'CC Jewellery',
        description: `Order #${orderResponse.orderNumber || 'New Order'}`,
        image: '/ccjewelers_logo.png',
        
        // Handler for successful payment
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          console.log('Razorpay Payment successful:', response);
          
          // Step 3: Verify Payment on Backend
          try {
            const verifyResponse = await postMethod({
              url: '/order/verifyrazorpay',
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartId: finalCartId,
                orderId: orderResponse.orderId
              }
            });

            if (verifyResponse.success) {
              toast.success(`🎉 Payment Successful! Order #${verifyResponse.orderNumber || orderResponse.orderNumber}`);
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
              setCartId(null);
            } else {
              setError('Payment verification failed: ' + (verifyResponse.message || 'Unknown error'));
              toast.error('Payment verification failed');
            }
          } catch (verifyError: any) {
            console.error('Verification error:', verifyError);
            setError('Payment verification failed. Please contact support.');
            toast.error('Payment verification failed');
          }
          
          setLoading(false);
        },
        
        // Pre-fill customer details
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        
        // Customize theme - Gold color for jewelry store
        theme: {
          color: '#D4AF37'
        },
        
        // Handle checkout close
        modal: {
          ondismiss: function () {
            console.log('Razorpay checkout closed by user');
            setLoading(false);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        setError('Payment gateway not loaded. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Razorpay payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Handle Stripe Payment
  const handleStripePayment = async () => {
    // Validate form fields
    for (const key in formData) {
      // @ts-ignore
      if (!formData[key]?.trim()) {
        setError("Please fill all required fields.");
        return;
      }
    }

    if (!stripeLoaded || typeof window.Stripe === 'undefined') {
      setError('Stripe payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Create cart and add items if not already done
      let finalCartId = cartId;
      if (!finalCartId) {
        finalCartId = await createCartAndAddItems();
      }

      // Step 1: Create Stripe payment intent on backend
      const orderResponse = await postMethod({
        url: '/order/stripe',
        body: {
          cartId: finalCartId,
          amount: total * 1.08,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          country: formData.country,
          phone: formData.phone
        }
      });

      if (!orderResponse.success || !orderResponse.paymentIntent) {
        setError(orderResponse.message || 'Failed to create payment intent. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Stripe Payment Intent created:', orderResponse);

      // Step 2: Initialize Stripe with publishable key
      const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!STRIPE_PUBLISHABLE_KEY) {
        setError('Stripe publishable key not configured. Please contact support.');
        setLoading(false);
        return;
      }

      if (!stripeElements || !cardElement) {
        setError('Stripe Elements not initialized. Please refresh the page.');
        setLoading(false);
        return;
      }

      const { stripe } = stripeElements;
      
      // Step 3: Create PaymentMethod using Stripe Elements (required by Stripe)
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
            country: getCountryCode(formData.country)
          }
        }
      });

      if (pmError) {
        setError(`Payment method creation failed: ${pmError.message}`);
        toast.error(`Payment failed: ${pmError.message}`);
        setLoading(false);
        return;
      }

      if (!paymentMethod) {
        setError('Failed to create payment method. Please try again.');
        toast.error('Failed to create payment method');
        setLoading(false);
        return;
      }

      // Step 4: Confirm payment with the PaymentMethod
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        orderResponse.paymentIntent.client_secret,
        {
          payment_method: paymentMethod.id
        }
      );

      if (confirmError) {
        setError(`Payment failed: ${confirmError.message}`);
        toast.error(`Payment failed: ${confirmError.message}`);
        setLoading(false);
        return;
      }

      // Step 5: Verify payment on backend
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const verifyResponse = await postMethod({
          url: '/order/confirmstripe',
          body: {
            payment_intent_id: paymentIntent.id,
            payment_intent_client_secret: orderResponse.paymentIntent.client_secret
          }
        });

        if (verifyResponse.success) {
          toast.success(`🎉 Payment Successful! Order #${verifyResponse.orderNumber || orderResponse.orderNumber}`);
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
          setError('Payment verification failed: ' + (verifyResponse.message || 'Unknown error'));
          toast.error('Payment verification failed');
        }
      } else {
        setError('Payment status: ' + (paymentIntent?.status || 'unknown'));
        toast.error('Payment did not succeed');
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'COD'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <Wallet className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold text-charcoal text-sm">COD</div>
                        <div className="text-xs text-charcoal/60">Pay on delivery</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AUTHORIZE_NET')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'AUTHORIZE_NET'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold text-charcoal text-sm">Card</div>
                        <div className="text-xs text-charcoal/60">Authorize.Net</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('RAZORPAY')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'RAZORPAY'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold text-charcoal text-sm">Razorpay</div>
                        <div className="text-xs text-charcoal/60">UPI / Cards / Wallets</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('STRIPE')}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'STRIPE'
                          ? 'border-gold bg-gold/10'
                          : 'border-charcoal/20 hover:border-gold/50'
                      }`}
                    >
                      <Zap className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold text-charcoal text-sm">Stripe</div>
                        <div className="text-xs text-charcoal/60">Cards / Apple Pay</div>
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

                  {/* CARD FIELDS - Show for Authorize.Net and Stripe */}
                  {(paymentMethod === 'AUTHORIZE_NET' || paymentMethod === 'STRIPE') && (
                    <>
                      <div className="md:col-span-2 border-t border-gold/20 pt-4 mt-2">
                        <h3 className="text-lg font-semibold text-charcoal mb-4">Card Details</h3>
                      </div>
                      
                      {paymentMethod === 'STRIPE' && stripeElements ? (
                        <>
                          <div className="md:col-span-2">
                            <div 
                              id="stripe-card-element" 
                              className="border border-gold py-3 px-4 rounded-lg bg-white"
                              style={{ minHeight: '40px' }}
                            />
                            <div id="stripe-card-errors" className="text-red-600 text-sm mt-2"></div>
                          </div>
                          <div className="md:col-span-2 p-3 bg-gold/5 rounded-lg text-xs text-charcoal/70">
                            <p className="font-medium mb-1">Test Cards (Stripe Test Mode):</p>
                            <p>• Success: 4242 4242 4242 4242</p>
                            <p>• Decline: 4000 0000 0000 0002</p>
                            <p>• CVV: Any 3 digits | Expiry: Any future date</p>
                          </div>
                        </>
                      ) : (
                        <>
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

                          {paymentMethod === 'AUTHORIZE_NET' && (
                            <div className="md:col-span-2 p-3 bg-gold/5 rounded-lg text-xs text-charcoal/70">
                              <p className="font-medium mb-1">Test Cards (Sandbox Mode):</p>
                              <p>• Approved: 4111 1111 1111 1111</p>
                              <p>• Declined: 4222 2222 2222 2220</p>
                              <p>• CVV: Any 3 digits | Expiry: Any future date (MM/YY)</p>
                            </div>
                          )}
                        </>
                      )}
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
                  } else if (paymentMethod === 'RAZORPAY') {
                    handleRazorpayPayment();
                  } else if (paymentMethod === 'STRIPE') {
                    handleStripePayment();
                  } else {
                    handlePlaceOrder();
                  }
                }}
                disabled={loading}
                className="w-full py-4 bg-gold text-white rounded-xl hover:bg-gold/90 transition-all font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : !showCheckoutForm ? (
                  "Proceed to Checkout"
                ) : paymentMethod === 'COD' ? (
                  <>
                    <Wallet className="w-5 h-5" />
                    Place Order (Cash on Delivery)
                  </>
                ) : paymentMethod === 'AUTHORIZE_NET' ? (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay with Authorize.Net
                  </>
                ) : paymentMethod === 'RAZORPAY' ? (
                  <>
                    <Smartphone className="w-5 h-5" />
                    Pay with Razorpay
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Pay with Stripe
                  </>
                )}
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
