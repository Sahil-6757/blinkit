import { useState, useEffect } from 'react'
import '../css/Profile.css'
import '../css/Order.css'
import '../css/Address.css'
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Heart, LogOut, MapPin, Plus, User, BoxIcon, Trash2 } from 'lucide-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
function Account() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = async (parsedUser) => {
    try {
      const addrRes = await fetch(`http://localhost:8000/addresses/${parsedUser.id}`);
      const addrData = await addrRes.json();
      setAddresses(addrData);

      const orderRes = await fetch(`http://localhost:8000/orders/${parsedUser.id}`);
      const orderData = await orderRes.json();
      
      // Ensure order items are parsed if they are strings
      const parsedOrders = orderData.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      
      setOrders(parsedOrders);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setForm({
        name: parsedUser.fullName || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        gender: parsedUser.gender || "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      });
      fetchUserData(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    title: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleAddress = () => {
    setForm({ ...form, title: "", address: "", city: "", state: "", zip: "", country: "" });
    setOpen(true);
  }

  const [steps, setSteps] = useState("profile");



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value.length > 10) return;
    setForm({ ...form, [name]: value });
  };


  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/addresses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success("Address deleted");
      }
    } catch (err) {
      toast.error("Error deleting address");
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/orders/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(orders.filter(order => order.id !== id));
        toast.success("Order cancelled successfully", {
          position: "bottom-center",
          autoClose: 800,
        });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Something went wrong");
    }
  };

  const handleMenu = (step) => {
    setSteps(step);
    if (step === "signout") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    }

    console.log(step)
  };

  const handleBtn = async () => {
    if (!user || !user.id) {
      toast.error("Please login again", {
        position: "top-right",
        autoClose: 800,
      });
      navigate("/login");
      return;
    }

    if (!form.address || !form.title) {
      toast.error("Please enter both title and address", {
        position: "top-right",
        autoClose: 800,
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: form.title,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          isDefault: addresses.length === 0
        })
      });

      if (res.ok) {
        const newAddr = await res.json();
        setAddresses([...addresses, newAddr]);
        setForm({ ...form, title: "", address: "", city: "", state: "", zip: "", country: "" });
        setOpen(false);
        toast.success("Address added successfully",
          {
            position: "bottom-center",
            autoClose: 800,
          }
        );
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save address");
      }
    } catch (err) {
      toast.error("Error saving address");
    }
  };

  const handleSave = async () => {
    console.log(form)
    if (!form.name || !form.email || !form.phone || !form.gender) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 800,
      });
      return;
    }

    // ✅ Gmail-only validation
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      toast.error("Only Gmail addresses are allowed", {
        position: "top-right",
        autoClose: 800,
      });
      return;
    }

    if (form.phone.toString().length !== 10) {
      toast.error("Please enter exactly 10 digits", {
        position: "top-right",
        autoClose: 800,
      })
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/user/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          gender: form.gender
        })
      });

      if (res.ok) {
        const updatedUser = { ...user, fullName: form.name, email: form.email, phone: form.phone, gender: form.gender };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Changes saved successfully", {
          position: "bottom-center",
          autoClose: 800,
        });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };


  return (
    <div className='container'>
      {
        steps === "signout" ? (
          <Login />
        ) : <>  <h5 className=''>My Account</h5>
          <div className="profile-container">

            {/* Sidebar */}
            <div className="sidebar">
              <div className={`menu ${steps === "profile" ? "active" : ""}`}
                onClick={() => handleMenu("profile")}><User size={16} /> My Profile</div>
              <div className={`menu ${steps === "orders" ? "active" : ""}`}
                onClick={() => handleMenu("orders")}><BoxIcon size={16} /> My Orders</div>
              <div className={`menu ${steps === "address" ? "active" : ""}`}
                onClick={() => handleMenu("address")}><MapPin size={16} /> Saved Addresses</div>
              <div className={`menu ${steps === "wishlist" ? "active" : ""}`}
                onClick={() => handleMenu("wishlist")}><Heart size={16} /> Wishlist</div>
              <div className={`text-danger menu ${steps === "signout" ? "active" : ""}`}
                onClick={() => handleMenu("signout")}><LogOut size={16} /> Sign Out</div>
            </div>

            {/* Main Content */}
            {
              steps === "profile" && (
                <div className="profile-content-form">
                  <h2>Personal Information</h2>

                  <div className="form-grid">
                    <div>
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className='p-2'
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label>Email</label>
                      <input
                        type="email"
                        className="p-2"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                        title="Only Gmail addresses are allowed"
                      />
                    </div>

                    <div>
                      <label>Phone</label>
                      <input
                        type="number"
                        placeholder="Enter your phone number"
                        name="phone"
                        className='p-2'
                        maxLength={10}
                        minLength={10}
                        pattern="[0-9]{10}"
                        title="Enter exactly 10 digits"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        className="p-2 form-select"
                        onChange={handleChange}
                      >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                </div>
              )
            }

            {
              steps === "orders" && (
                <div className="profile-content">
                  <div className="orders-container">
                    {orders.map((order) => (
                      
                      <div className="order-card" key={order.id}>
                        {console.log(order)}
                        <div className="order-top">
                          <div>
                            <p className="date">{order.date}</p>
                          </div>

                          <span
                            className={`status ${order.status === "Delivered"
                              ? "delivered"
                              : "transit"
                              }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Middle */}
                        <div className="order-middle">
                          <div className="items">
                            {(Array.isArray(order.items) ? order.items : []).map((item, index) => {

                              const isObject = typeof item === 'object' && item !== null;
                              return (
                                <div key={item.id || index} className="order-item-detail">
                                  <span className="icon">{isObject ? item.icon : item}</span>
                                  {isObject && item.name && (
                                    <span className="item-info-text">
                                      {item.name} x {item.quantity || 1}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            <div className="mt-2">
                              <span className="item-count">{order.itemCount} items total</span>
                            </div>
                          </div>

                          <div className="price">₹{order.price}</div>
                        </div>

                        {/* Bottom */}
                        <div className="order-bottom d-flex justify-content-between align-items-center">
                          <span>📍 {order.address}</span>
                          {order.status !== "Delivered" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => cancelOrder(order.id)}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>

                      </div>
                    ))}



                  </div>

                </div>
              )
            }

            {
              steps === "address" && (
                <div className="profile-content">
                  <div className='Address-header'>
                    <h4>Saved Addresses</h4>
                    <button className="add-btn" onClick={handleAddress}> <Plus size={16} /> Add Address</button>
                  </div>
                  <div className="address-container">
                    {addresses.map((address) => (
                      <div className="address-card" key={address.id}>
                        <div className="address-top">
                          <div style={{ flex: 1 }}>
                            <h4 className='order-id'>{address.title}</h4>
                            <p className="date">{address.address}</p>
                          </div>
                          <div className='d-flex align-items-center gap-2'>
                            {/* <span
                              className={`status ${address.isDefault
                                ? "default"
                                : ""}`}
                            >
                              {address.isDefault ? "Default" : ""}
                            </span> */}
                            <button
                              className='btn btn-sm text-danger border-0 p-0'
                              onClick={() => deleteAddress(address.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {
              steps === "wishlist" && (
                <div className="profile-content">
                  <h4 className='text-center'>My Wishlist</h4>
                </div>
              )

            }

          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box tabIndex={0} sx={{ ...style, width: 500 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                Add New Address
              </Typography>
              <TextField
                required
                id="standard-basic-title"
                label="Address Title"
                placeholder="e.g. Home, Office"
                variant="standard"
                value={form.title}
                name="title"
                type="text"
                sx={{ mb: 2, width: "100%" }}
                onChange={handleChange}
                autoFocus
              />
              <TextField
                required
                id="standard-basic"
                label="Address"
                placeholder="Enter new address"
                variant="standard"
                value={form.address}
                name="address"
                type="text"
                multiline
                rows={2}
                sx={{ mb: 2, width: "100%" }}
                onChange={handleChange}
              />
              <div className="row">
                <div className="col-md-6">
                  <TextField
                    id="standard-city"
                    label="City"
                    placeholder="City"
                    variant="standard"
                    value={form.city}
                    name="city"
                    sx={{ mb: 2, width: "100%" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    id="standard-state"
                    label="State"
                    placeholder="State"
                    variant="standard"
                    value={form.state}
                    name="state"
                    sx={{ mb: 2, width: "100%" }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <TextField
                    id="standard-zip"
                    label="Zip Code"
                    placeholder="Zip Code"
                    variant="standard"
                    value={form.zip}
                    name="zip"
                    sx={{ mb: 2, width: "100%" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    id="standard-country"
                    label="Country"
                    placeholder="Country"
                    variant="standard"
                    value={form.country}
                    name="country"
                    sx={{ mb: 2, width: "100%" }}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button className="save-btn w-100 mt-2" onClick={handleBtn}>Save Address</button>
            </Box>
          </Modal>
        </>
      }


    </div>
  )
}

export default Account
