import  { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { getCart, addToCart, removeFromCart } from '../../utils/cartUtils';
import '../../css/ProductCards.css';
import '../../App.css';

function CategoryLayout({ categoryName, subCategories, icon }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const handleCartChange = () => {
      setCart(getCart());
    };
    window.addEventListener('cartChange', handleCartChange);
    return () => window.removeEventListener('cartChange', handleCartChange);
  }, []);

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    return cat.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/items');
        const data = await response.json();
        const categoryItems = data.filter(item => {
          const normItemCat = normalizeCategory(item.category);
          const normFilterCat = normalizeCategory(categoryName);
          return normItemCat === normFilterCat || 
                 normItemCat.includes(normFilterCat) || 
                 normFilterCat.includes(normItemCat);
        });
        setItems(categoryItems);
        setFilteredItems(categoryItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };
    fetchItems();
  }, [categoryName]);

  // Use dynamic subcategories from items if available, merged with passed props
  const dynamicSubCategories = [...new Set([
    ...(subCategories || []),
    ...items.filter(i => i.subCategory).map(i => i.subCategory)
  ])];

  const filters = [
    { name: 'All', count: items.length },
    ...dynamicSubCategories.map(sub => ({
      name: sub,
      count: items.filter(i => i.subCategory === sub).length
    }))
  ];

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    let updatedItems = items;
    if (filterName !== 'All') {
      updatedItems = items.filter(item => item.subCategory === filterName);
    }
    applySort(updatedItems, sortBy);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    applySort(filteredItems, sortValue);
  };

  const applySort = (itemsToSort, sortType) => {
    let sorted = [...itemsToSort];
    if (sortType === 'Price: Low to High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'Price: High to Low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortType === 'Discount') {
      sorted.sort((a, b) => {
        const discA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const discB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return discB - discA;
      });
    }
    setFilteredItems(sorted);
  };

  const handleAdd = (item) => {
    addToCart(item);
  };

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const handleDecrease = (id) => {
    removeFromCart(id);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="d-flex align-items-center gap-2" style={{ fontWeight: '800' }}>
          {icon} {categoryName}
        </h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <div className="position-relative">
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={handleSortChange}
              style={{ paddingRight: '30px' }}
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {filters.map(filter => (
          <button
            key={filter.name}
            onClick={() => handleFilterChange(filter.name)}
            className={`btn rounded-pill px-3 py-1 ${activeFilter === filter.name ? 'btn-success' : 'btn-outline-secondary'}`}
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            {filter.name} ({filter.count})
          </button>
        ))}
      </div>

      <p className="text-muted mb-4">{filteredItems.length} products</p>

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
    </div>
  );
}

export default CategoryLayout;
