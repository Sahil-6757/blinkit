import "../App.css";
import {
  MapPin,
  Search,
  User,
  ShoppingCart,
  Zap,
  ChevronDown,
  Navigation,
  Menu,
  X,
} from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../utils/cartUtils";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCartCount(Object.keys(cart).length);
    };

    updateCartCount();
    window.addEventListener('cartChange', updateCartCount);
    
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener('cartChange', updateCartCount);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [location, setlocation] = useState(null);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  const handleDelivery = async () => {
    handleOpen();
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // You can use the latitude and longitude to fetch location details or update the UI
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("Location details:", data);
              setlocation(data);
              // You can update the UI with the location details here
              handleClose();
            })
            .catch((error) => {
              console.error("Error fetching location details:", error);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const handleIcon = () => {};

  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <div className="home" onClick={handleIcon}>
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            <h2 className="logo">
              {<Zap size={20} style={{ color: "#ffc105" }} />} blink
              <span className="it">it</span>
            </h2>
          </Link>
        </div>

        <div className="location" onClick={handleDelivery}>
          <span className="delivery-text">DELIVERY IN</span>
          <div className="location-row">
            <MapPin size={16} style={{ color: "#ffffffb3" }} />
            {location ? (
              <span style={{ color: "#ffffffb3" }}>
                {location.address.city ||
                  location.address.town ||
                  location.address.village ||
                  "Unknown Location"}
              </span>
            ) : (
              <span style={{ color: "#ffffffb3" }}>Select Location</span>
            )}
            {<ChevronDown size={16} style={{ color: "#ffffffb3" }} />}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" onClick={handleSearchClick} style={{ cursor: 'pointer' }} />
        <input 
          type="text" 
          className="p-0" 
          placeholder='Search "groceries"' 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <Link
              to={
                (localStorage.getItem('admin') === 'true' ||
                 (user?.username && user.username.toLowerCase() === 'admin'))
                  ? "/admin"
                  : "/account"
              }
              style={{ textDecoration: "none", color: "white" }}
            >
              <div className="account">
                <User size={20} />
                <span className="account">{user.username}</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-sm btn-outline-light"
              style={{ fontWeight: 'bold' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
            <div className="account">
              <User size={20} />
              <span className="account">Login</span>
            </div>
          </Link>
        )}
        <Link to="/cart" style={{ textDecoration: "none", color: "white" }}>
          <button className="cart-btn">
            <ShoppingCart size={18} />
            {cartCount > 0 ? `My Cart (${cartCount})` : 'My Cart'}
          </button>
        </Link>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {<MapPin size={20} style={{ color: "#1e8549" }} />} Choose Your
            Delivery Location
          </Typography>
          <button className="Detect-btn" onClick={detectLocation}>
            {
              <Navigation
                size={20}
                style={{ color: "#1e8549" }}
                className="mx-2"
              />
            }
            Detect my Location
          </button>
          <p className="or">OR</p>
          <input
            type="text"
            placeholder="Search delivery location"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #1e8549",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
