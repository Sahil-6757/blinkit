import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Ticket, Receipt, ShoppingBag, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { getCart, addToCart, removeFromCart, deleteFromCart, clearCart } from '../utils/cartUtils';
import '../css/Cart.css';
import { toast } from 'react-toastify';

function Cart() {
  const [cart, setCart] = useState(getCart());
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Calculate cart totals
  const cartItems = Object.values(cart);
  const itemTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal > 0 ? 15 : 0;
  const handlingFee = itemTotal > 0 ? 5 : 0;
  const savings = Math.floor(itemTotal * 0.1); // Simulated 10% savings
  const grandTotal = itemTotal + deliveryFee + handlingFee;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAddresses(parsedUser.id);
    }

    const handleCartChange = () => {
      setCart(getCart());
    };
    window.addEventListener('cartChange', handleCartChange);
    return () => window.removeEventListener('cartChange', handleCartChange);
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/addresses/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserAddresses(data);
        const defaultAddr = data.find(addr => addr.isDefault) || data[0];
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const handleTotal = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      userId: user.id,
      orderId: `ORD-${Date.now()}`,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        quantity: item.quantity,
        price: item.price
      })),
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      address: selectedAddress.address,
      price: grandTotal - savings
    };

    try {
      const res = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        toast.success("Order placed successfully!", {
          position: "bottom-center",
          autoClose: 800,
        });
        clearCart();
        setTimeout(() => {
          navigate('/account');
        }, 2000);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Error connecting to server");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart-container">
            <div className="empty-cart-card">
              <div className="empty-cart-illustration">
                <ShoppingBag size={80} strokeWidth={1.5} color="#0c831f" />
                <div className="illustration-badge">!</div>
              </div>
              <h3>Your cart is empty</h3>
              <p>You haven't added anything to your cart yet. Let's find some amazing products for you!</p>
              <Link to="/" className="browse-products-btn">
                Start Shopping <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left Section: Items */}
        <div className="cart-left">
          <div className="delivery-time-banner">
            <div className="time-icon">
              <Clock size={20} />
            </div>
            <div className="time-info">
              <p className="time-label">Delivery in 10 minutes</p>
              <p className="time-sub">Shipment from nearest store</p>
            </div>
          </div>

          <div className="cart-header-card">
            <div className="header-left">
              <h2>My Cart</h2>
              <span className="item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
            <button className="clear-cart-link" onClick={clearCart}>
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>

          <div className="cart-items-wrapper">
            {cartItems.map((item) => (
              <div className="cart-item-row" key={item.id}>
                <div className="item-img-box">
                  <span className="item-emoji">{item.icon}</span>
                </div>
                <div className="item-details">
                  <h4 className="item-title">{item.name}</h4>
                  <p className="item-weight">{item.qty}</p>
                  <div className="item-price-row">
                    <span className="current-price">₹{item.price}</span>
                    <span className="old-price">₹{Math.floor(item.price * 1.2)}</span>
                  </div>
                </div>
                <div className="item-controls">
                  <div className="quantity-selector">
                    <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart({ id: item.id })}>+</button>
                  </div>
                  <div className="item-total-price">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="safety-badges">
            <div className="badge">
              <ShieldCheck size={18} color="#0c831f" />
              <span>Safe and Secure Payments</span>
            </div>
            <div className="badge">
              <ShieldCheck size={18} color="#0c831f" />
              <span>100% Authentic Products</span>
            </div>
          </div>
        </div>

        {/* Right Section: Summary */}
        <div className="cart-right">
          {/* Delivery Address */}
          <div className="summary-card address-card">
            <div className="summary-title">
              <MapPin size={18} /> <span>Delivery Address</span>
            </div>
            <div className="address-list">
              {userAddresses.length > 0 ? (
                userAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-item ${selectedAddress?.id === addr.id ? 'active' : ''}`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div className="address-radio">
                      <div className="radio-inner"></div>
                    </div>
                    <div className="address-text">
                      <h5>{addr.title}</h5>
                      <p>{addr.address}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-address">
                  <p>No addresses found. Please add an address to proceed.</p>
                </div>
              )}
            </div>
            <button className="add-address-btn" onClick={() => navigate('/account')}>
              + Manage Addresses
            </button>
          </div>

          {/* Coupons */}
          <div className="summary-card coupon-card">
            <div className="summary-title">
              <Ticket size={18} /> <span>Coupons and Offers</span>
            </div>
            <div className="coupon-box">
              <input type="text" placeholder="Enter coupon code" />
              <button className="coupon-apply">APPLY</button>
            </div>
            <p className="coupon-hint">Save up to ₹100 with coupons</p>
          </div>

          {/* Bill Summary */}
          <div className="summary-card bill-card">
            <div className="summary-title">
              <Receipt size={18} /> <span>Bill Details</span>
            </div>
            <div className="bill-rows">
              <div className="bill-item">
                <span className="label">Item Total</span>
                <span className="value">₹{itemTotal}</span>
              </div>
              <div className="bill-item savings">
                <span className="label">Product Discount</span>
                <span className="value">-₹{savings}</span>
              </div>
              <div className="bill-item">
                <span className="label">Delivery Fee</span>
                <span className="value">₹{deliveryFee}</span>
              </div>
              <div className="bill-item">
                <span className="label">Handling Charge</span>
                <span className="value">₹{handlingFee}</span>
              </div>
              <div className="bill-divider"></div>
              <div className="bill-item total">
                <span className="label">Grand Total</span>
                <span className="value">₹{grandTotal - savings}</span>
              </div>
            </div>
            
            <div className="savings-badge">
              Yay! You saved ₹{savings} on this order
            </div>

            <button className="checkout-btn" onClick={handleTotal}>
              <div className="checkout-info">
                <span className="price">₹{grandTotal - savings}</span>
                <span className="label">TOTAL</span>
              </div>
              <div className="checkout-action">
                Place Order <ChevronRight size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
