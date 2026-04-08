import { Zap, Shield, Truck, Headphones } from "lucide-react";
import { useState, useEffect } from "react";
import { getCart, addToCart, removeFromCart } from "../utils/cartUtils";
import "../App.css";
import "../css/CategoryGrid.css";
import "../css/ProductCards.css";
import "../css/Footer.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';

function Home() {
  const [cart, setCart] = useState(getCart());
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCartChange = () => {
      setCart(getCart());
    };
    window.addEventListener('cartChange', handleCartChange);
    return () => window.removeEventListener('cartChange', handleCartChange);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/items');
        const data = await response.json();
        setAllItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchItems(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    return cat.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Derive categories from allItems
  const products = allItems.filter(item => item.tag === "Bestseller");
  const Fruits_vegetables = allItems.filter(item => {
    const norm = normalizeCategory(item.category);
    return norm.includes("fruits and vegetables") || norm === "fruits and vegetables";
  });
  const DailyBread = allItems.filter(item => {
    const norm = normalizeCategory(item.category);
    return norm.includes("dairy bread and eggs") || norm === "dairy bread and eggs";
  });
  const snacks = allItems.filter(item => {
    const norm = normalizeCategory(item.category);
    return norm.includes("snacks and munchies") || norm === "snacks and munchies";
  });
  const tea = allItems.filter(item => {
    const norm = normalizeCategory(item.category);
    return norm.includes("tea coffee and drinks") || norm === "tea coffee and drinks";
  });
  const cleaning = allItems.filter(item => {
    const norm = normalizeCategory(item.category);
    return norm.includes("cleaning essentials") || norm === "cleaning essentials";
  });

  const handleAdd = (item) => {
    addToCart(item);
  };

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const handleDecrease = (id) => {
    removeFromCart(id);
  };

  const renderProductCard = (item, index) => (
    <div className="product-card" key={item.id || index}>
      {/* Top badges */}
      <div className="badge-row">
        {item.offer && <span className="offer">{item.offer}</span>}
        {item.tag && <span className="tag">{item.tag}</span>}
      </div>

      {/* Image */}
      <div className="product-img">{item.icon}</div>

      {/* Info */}
      <p className="delivery">8 min delivery</p>
      <h4 className="name">{item.name}</h4>
      <p className="qty">{item.qty}</p>

      {/* Bottom */}
      <div className="bottom-row">
        <div>
          <span className="price">₹{item.price}</span>
          {item.oldPrice && (
            <span className="old-price">₹{item.oldPrice}</span>
          )}
        </div>
        <button
          className={`add-btn ${cart[item.id] ? 'added' : ''}`}
          onClick={() => handleAdd(item)}
        >
          {cart[item.id] ? 'ADDED' : 'ADD'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold' }}>
        <DotLottieReact
          src="https://lottie.host/6b83ad5b-45ef-4201-ba7b-095636301824/8I9Cf02wuq.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  return (
    <div>
      <div className="banner">
        <div className="onee">
          <div className="tag">
            <Zap size={20} color="#ffc105" />
            <p>Delivery in 8 minutes</p>
          </div>
          <div className="tagDetails">
            <h1>
              Groceries delivered in{" "}
              <span className="minutes">minutes</span>{" "}
            </h1>
            <p className="text-muted ">
              Get your daily essentials, fresh fruits, vegetables, dairy, snacks
              & more delivered to your doorstep in just minutes.
            </p>
          </div>
        </div>
        <div className="two">
          <div className="button-category">
            <button className="category-btn">🥦 Fresh Produce</button>
            <button className="category-btn">🥛 Dairy & Eggs</button>
            <button className="category-btn">🍿 Snacks</button>
            <button className="category-btn">💊 Pharma</button>
          </div>
        </div>
      </div>
      <div className="category">
        <div className="category-section">
          <div className="category-grid">
            {categories.map((item, index) => (
              <Link to={`/category/${item.slug}`} style={{ textDecoration: "none" }} key={index}>
                <div className="category-card" key={index}>
                  <div className="icon-box">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="best-seller">
        <h4>🔥 Best Sellers</h4>
        <div className="product-section">
          <div className="product-grid">
            {products.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>

      <div className="best-seller">
        <h4>🥦 Fresh fruits & vegetables</h4>
        <div className="product-section">
          <div className="product-grid">
            {Fruits_vegetables.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>

      <div className="best-seller">
        <h4>🥦 Dairy,Bread & Eggs</h4>
        <div className="product-section">
          <div className="product-grid">
            {DailyBread.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>

      <div className="best-seller">
        <h4>🍟 Snacks & Munchies</h4>
        <div className="product-section">
          <div className="product-grid">
            {snacks.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>

      <div className="best-seller">
        <h4>☕ Tea, Coffee & Drinks</h4>
        <div className="product-section">
          <div className="product-grid">
            {tea.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>

      <div className="best-seller">
        <h4>🧹 Cleaning essentials</h4>
        <div className="product-section">
          <div className="product-grid">
            {cleaning.map((item, index) => renderProductCard(item, index))}
          </div>
        </div>
      </div>
      <div className="footer-top">
        <div className="feature">
          <Zap size={22} />
          <div>
            <h4>Superfast Delivery</h4>
            <p>Get your order in minutes</p>
          </div>
        </div>

        <div className="feature">
          <Shield size={22} />
          <div>
            <h4>Best Prices & Offers</h4>
            <p>Best price destination</p>
          </div>
        </div>

        <div className="feature">
          <Truck size={22} />
          <div>
            <h4>Free Delivery</h4>
            <p>On orders above ₹199</p>
          </div>
        </div>

        <div className="feature">
          <Headphones size={22} />
          <div>
            <h4>24/7 Support</h4>
            <p>We’re always here to help</p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Home;
