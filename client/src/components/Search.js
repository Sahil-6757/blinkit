import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCart, addToCart, removeFromCart } from '../utils/cartUtils';
import '../css/ProductCards.css';
import '../App.css';

function Search() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(getCart());
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

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
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (query) {
      const results = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItems(results);
    } else {
      setFilteredItems(items);
    }
  }, [query, items]);

  const handleAdd = (item) => {
    addToCart(item);
  };

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const handleDecrease = (id) => {
    removeFromCart(id);
  };

  if (loading) return <div className="loading">Searching...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ fontWeight: '800' }}>
        Search Results for "{query}"
      </h2>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <h3>No products found for "{query}"</h3>
          <p className="text-muted">Try searching for something else like "milk", "banana", or "chips".</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">{filteredItems.length} products found</p>
          <div className="product-grid">
            {filteredItems.map((item) => (
              <div className="product-card" key={item.id}>
                <div className="badge-row">
                  {item.offer && <span className="offer">{item.offer}</span>}
                  {item.tag && <span className="tag">{item.tag}</span>}
                </div>
                <div className="product-img" style={{ fontSize: '60px' }}>{item.icon}</div>
                <p className="delivery">{item.delivery || '8 min'} delivery</p>
                <h4 className="name">{item.name}</h4>
                <p className="qty">{item.qty}</p>
                <div className="bottom-row">
                  <div>
                    <span className="price">₹{item.price}</span>
                    {item.oldPrice && <span className="old-price">₹{item.oldPrice}</span>}
                  </div>
                  <button 
                    className={`add-btn ${cart[item.id] ? 'added' : ''}`} 
                    onClick={() => handleAdd(item)}
                  >
                    {cart[item.id] ? 'ADDED' : 'ADD'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
