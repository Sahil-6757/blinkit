import { useState, useEffect } from 'react'
import { BoxIcon, Plus, Trash2, CheckCircle, Truck, XCircle, ShoppingBag, Layers, ListIcon, LayersIcon, ListOrderedIcon, UserIcon, UserCheck, UserCheckIcon, UserCheck2Icon, LogOutIcon, BluetoothSearchingIcon, RssIcon, Edit, Heading3, Eye, FileText, CheckCircle2, CheckCircle2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import "../css/sidebar.css";
import {

  FaCommentDots,

} from "react-icons/fa";
function Admin() {
  const [steps, setSteps] = useState("dashboard");
  const [allOrders, setAllOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();

  const [itemForm, setItemForm] = useState({
    id: "",
    name: "",
    qty: "",
    price: "",
    oldPrice: "",
    offer: "",
    tag: "",
    icon: "",
    category: "",
    subCategory: "",
    delivery: "",
    stock: ""
  });
  const [applications, setApplications] = useState([]);

  const [catForm, setCatForm] = useState({
    name: "",
    icon: "",
    slug: ""
  });

  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "General" });
  const [isFaqEdit, setIsFaqEdit] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const ordersPerPage = 6;

  const normalizeCategory = (cat) => {
    if (!cat) return "";
    return cat.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));

    if (!isAdmin || !user || user.username.toLowerCase() !== 'admin') {
      navigate('/login');
      return;
    }

    fetchOrders();
    fetchItems();
    fetchCategories();
    fetchFaqs();
    fetchBlogs();
    fetchContacts();
    getApplications();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:8000/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      toast.error("Failed to fetch contact messages", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`http://localhost:8000/contacts/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("Message deleted", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchContacts();
        }
      } catch (err) {
        toast.error("Failed to delete message", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch('http://localhost:8000/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (err) {
      toast.error("Failed to fetch FAQs", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const [blogForm, setBlogForm] = useState({
    blogTitle: "",
    blogImage: "",
    blogContent: ""
  });
  const [isBlogEdit, setIsBlogEdit] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      toast.error("Failed to fetch blogs", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await fetch(`http://localhost:8000/blogs/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("Blog deleted", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchBlogs();
        }
      } catch (err) {
        toast.error("Failed to delete blog", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    }
  };

  const handleFileChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  const handleEditBlog = (blog) => {
    setIsBlogEdit(true);
    setCurrentBlogId(blog.id);
    setBlogForm({
      blogTitle: blog.blogTitle,
      blogImage: blog.blogImage,
      blogContent: blog.blogContent
    });
  };

  const handleEditFaq = (faq) => {
    setIsFaqEdit(true);
    setCurrentFaqId(faq.id);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "General"
    });
    setOpenFaq(true);
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      toast.error("Please fill in both question and answer");
      return;
    }
    try {
      const url = isFaqEdit ? `http://localhost:8000/faqs/${currentFaqId}` : 'http://localhost:8000/faqs';
      const method = isFaqEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      });
      if (res.ok) {
        toast.success(isFaqEdit ? "FAQ updated successfully" : "FAQ added successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        setOpenFaq(false);
        setIsFaqEdit(false);
        setCurrentFaqId(null);
        fetchFaqs();
        setFaqForm({ question: "", answer: "", category: "General" });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || (isFaqEdit ? "Failed to update FAQ" : "Failed to add FAQ"), {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    } catch (err) {
      toast.error(isFaqEdit ? "Failed to update FAQ" : "Failed to add FAQ");
    }
  };

  const deleteFaq = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const res = await fetch(`http://localhost:8000/faqs/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("FAQ deleted", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchFaqs();
        }
      } catch (err) {
        toast.error("Failed to delete FAQ", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    }
  };

  const addBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.blogTitle || !blogForm.blogImage || !blogForm.blogContent) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("blogTitle", blogForm.blogTitle);
      formData.append("blogImage", blogForm.blogImage);
      formData.append("blogContent", blogForm.blogContent);

      const url = isBlogEdit ? `http://localhost:8000/blogs/${currentBlogId}` : 'http://localhost:8000/blogs';
      const method = isBlogEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: formData
      });
      if (res.ok) {
        toast.success(isBlogEdit ? "Blog updated successfully" : "Blog added successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        setIsBlogEdit(false);
        setCurrentBlogId(null);
        fetchBlogs();
        setBlogForm({ blogTitle: "", blogImage: "", blogContent: "" });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || (isBlogEdit ? "Failed to update blog" : "Failed to add blog"));
      }
    } catch (err) {
      toast.error(isBlogEdit ? "Failed to update blog" : "Failed to add blog");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/orders');
      if (res.ok) {
        const data = await res.json();
        // Ensure items are parsed correctly
        const parsedOrders = data.map(order => ({
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }));
        setAllOrders(parsedOrders);
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:8000/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      toast.error("Failed to fetch items");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleCatChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      if (res.ok) {
        toast.success("Category added successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        setOpenCat(false);
        fetchCategories();
        setCatForm({ name: "", icon: "" });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add category");
      }
    } catch (err) {
      toast.error("Failed to add category", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure? This might affect products in this category.")) {
      try {
        const res = await fetch(`http://localhost:8000/categories/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("Category deleted", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchCategories();
        }
      } catch (err) {
        toast.error("Failed to delete category", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setItemForm({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      oldPrice: item.oldPrice,
      offer: item.offer,
      tag: item.tag,
      icon: item.icon,
      category: item.category,
      subCategory: item.subCategory,
      delivery: item.delivery,
      stock: item.stock
    });
    setOpen(true);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit ? `http://localhost:8000/items/${currentId}` : 'http://localhost:8000/items';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemForm)
      });
      if (res.ok) {
        toast.success(isEdit ? "Item updated successfully" : "Item added successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        setOpen(false);
        setIsEdit(false);
        setCurrentId(null);
        fetchItems();
        setItemForm({
          id: "", name: "", qty: "", price: "", oldPrice: "", offer: "",
          tag: "", icon: "", category: "", subCategory: "", delivery: "", stock: ""
        });
      }
    } catch (err) {
      toast.error(isEdit ? "Failed to update item" : "Failed to add item", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`http://localhost:8000/items/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("Item deleted", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchItems();
        }
      } catch (err) {
        toast.error("Failed to delete item", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
    }
  };



  const handleFaqChange = (e) => {
    setFaqForm({ ...faqForm, [e.target.name]: e.target.value });
  };


  const getApplications = async () => {
    try {
      const res = await fetch('http://localhost:8000/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      toast.error("Failed to fetch applications", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`, {
          autoClose: 800,
          position: "bottom-center"
        });
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to update status", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const toggleFooterStatus = async (cat) => {
    try {
      const res = await fetch(`http://localhost:8000/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showInFooter: !cat.showInFooter })
      });
      if (res.ok) {
        toast.success("Category footer status updated", {
          autoClose: 800,
          position: "bottom-center"
        });
        fetchCategories();
      }
    } catch (err) {
      toast.error("Failed to update category", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.dispatchEvent(new Event("authChange"));
    navigate('/login');
  }

  const handleMenu = (step) => {
    setSteps(step);
  }


  return (
    
    <>
      <div className='Admin-Container'>
        <div className='sidebar'>
          <p className='sidebar-title' onClick={() => setSteps("dashboard")}> <BoxIcon /> Admin Dashboard</p>
          <p className='sidebar-title' onClick={() => setSteps("products")}> <ListIcon /> Manage Products</p>
          <p className='sidebar-title' onClick={() => setSteps("categories")}> <LayersIcon /> Manage Categories</p>
          <p className='sidebar-title' onClick={() => setSteps("orders")}> <ListOrderedIcon /> Manage Orders</p>
          {/* <p className='sidebar-title' onClick={() => setSteps("users")}> <UserIcon /> Manage Users</p> */}
          <p className='sidebar-title' onClick={() => setSteps("roles")}> <UserIcon /> Manage Role</p>
          <p className='sidebar-title' onClick={() => setSteps("blogs")}> <RssIcon /> Manage Blogs</p>
          <p className='sidebar-title' onClick={() => setSteps("faqs")}> <UserCheckIcon /> Manage FAQs</p>
          <p className='sidebar-title' onClick={() => setSteps("applications")}> <UserCheckIcon /> Manage Applications</p>
          <p className='sidebar-title' onClick={() => setSteps("contacts")}> <FaCommentDots /> Contact Messages</p>
          <p className='sidebar-title' onClick={() => setSteps("terms")}> <UserCheck2Icon /> Terms and Conditions</p>
          {/* <p className='sidebar-title' style={{ color: "red" }} onClick={() => handleLogout()}> <LogOutIcon /> Logout</p> */}
        </div>

        <div className='admin-mainContent'>


          {
            steps === "dashboard" && (
              <div className="dashboard-content-form">
                <h4 className="text-center text-success">Admin Dashboard</h4>
                <p className="text-muted text-center">Welcome to the Admin Dashboard!</p>
                <div className='row'>
                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <RssIcon />
                        <p>Blog Posts</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{blogs.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <ShoppingBag size={24} />
                        <p>Total Items</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{items.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <Layers size={24} />
                        <p>Total Categories</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{categories.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <BoxIcon size={24} />
                        <p>Total Orders</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{allOrders.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <ListIcon size={24} />
                        <p>Total FAQs</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{faqs.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 my-2'>
                    <div className='card'>
                      <div className='card-header'>
                        <FaCommentDots size={24} />
                        <p>Total Messages</p>
                        <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{contacts.length}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            )
          }
          {
            steps === "products" && (
              <div className="admin-items">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <h4>Product Inventory</h4>
                  <div className="d-flex gap-3 align-items-center">
                    <FormControl size="small" style={{ minWidth: 200 }}>
                      <InputLabel id="filter-category-label">Filter Category</InputLabel>
                      <Select
                        labelId="filter-category-label"
                        value={filterCategory}
                        label="Filter Category"
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <MenuItem value="All">All Categories</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setOpen(true); setIsEdit(false); setItemForm({ id: "", name: "", qty: "", price: "", oldPrice: "", offer: "", tag: "", icon: "", category: "", subCategory: "", delivery: "", stock: "" }); }}>
                      <Plus size={18} /> Add New Product
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Icon</th>
                        <th>Product Info</th>
                        <th>Price</th>
                        <th>Offer</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items
                        .filter(item => {
                          if (filterCategory === "All") return true;
                          const normItemCat = normalizeCategory(item.category);
                          const normFilterCat = normalizeCategory(filterCategory);
                          return normItemCat === normFilterCat ||
                            normItemCat.includes(normFilterCat) ||
                            normFilterCat.includes(normItemCat);
                        })
                        .map((item) => (
                          <tr key={item.id}>
                            <td className="fs-3">{item.icon}</td>
                            <td>
                              <div className="fw-bold">{item.name}</div>
                              <small className="text-muted">{item.qty} | {item.category}</small>
                            </td>
                            <td>
                              <div>₹{item.price}</div>
                              <small className="text-decoration-line-through text-muted">₹{item.oldPrice}</small>
                            </td>
                            <td><span className="badge bg-info text-dark">{item.offer}</span></td>
                            <td><span className={`badge ${item.stock === 'Available' ? 'bg-success' : 'bg-danger'}`}>{item.stock}</span></td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleEdit(item)}>
                                  Edit
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => deleteItem(item.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "categories" && (
              <div className="admin-categories">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Categories</h4>
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setOpenCat(true)}>
                    <Plus size={18} /> Add New Category
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Icon</th>
                        <th>Category Name</th>
                        <th>Slug</th>
                        <th>Created At</th>
                        <th>Actions</th>
                        <th>Allow to Add in footer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id}>
                          <td className="fs-4">{cat.icon}</td>
                          <td className="fw-bold">{cat.name}</td>
                          <td><code>{cat.slug}</code></td>
                          <td><small>{new Date(cat.createdAt).toLocaleDateString()}</small></td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCategory(cat.id)}>
                              <Trash2 size={16} />
                            </button>
                            
                          </td>
                          <td>
                            <div className="form-check form-switch">
  <input className="form-check-input toggleSwitch-btn" type="checkbox" role="switch" id="switchCheckDefault" checked={cat.showInFooter} onChange={() => toggleFooterStatus(cat)} />
</div> </td>
                   
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "orders" && (
              <div className="admin-orders">
                <h4 className="mb-4">All Customer Orders</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders
                        .slice((currentOrderPage - 1) * ordersPerPage, currentOrderPage * ordersPerPage)
                        .map((order) => (
                        <tr key={order.id}>
                          {
                            console.log(order)
                          }
                          <td><small className="text-muted">{order.orderId}</small></td>
                          <td>
                            <div>{order.User?.fullName}</div>
                            <small className="text-muted">{order.User?.email}</small>
                            <small className="text-muted d-block">{order.User?.phone}</small>
                            <small className="text-muted d-block mt-1">
                              <strong>Address:</strong> {order.address}
                            </small>
                          </td>
                          <td>
                            <div className="admin-item-list">
                              {Array.isArray(order.items) && order.items.map((item, i) => (
                                <div key={i} className="mb-1 d-flex justify-content-between">
                                  <span>{item.name || item}</span>
                                  <span className="text-muted">x{item.quantity || 1}</span>
                                </div>
                              ))}
                              <hr className="my-1" />
                              <small className="d-block text-muted">{order.itemCount} items total</small>
                            </div>
                          </td>
                          <td>₹{order.price}</td>
                          <td>
                            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => updateOrderStatus(order.id, 'In Transit')}
                                title="Set to In Transit"
                              >
                                <Truck size={14} />
                              </button>
                              <button
                                className="btn btn-outline-success"
                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                title="Set to Delivered"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                title="Cancel Order"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted small">
                    Showing {(currentOrderPage - 1) * ordersPerPage + 1} to {Math.min(currentOrderPage * ordersPerPage, allOrders.length)} of {allOrders.length} orders
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentOrderPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentOrderPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                      </li>
                      {[...Array(Math.ceil(allOrders.length / ordersPerPage))].map((_, i) => (
                        <li key={i} className={`page-item ${currentOrderPage === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentOrderPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentOrderPage === Math.ceil(allOrders.length / ordersPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentOrderPage(prev => Math.min(prev + 1, Math.ceil(allOrders.length / ordersPerPage)))}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )
          }
          {
            steps === "users" && (
              <div className="dashboard-content-form">
                <h4>Manage Users</h4>
                <p className="text-muted">Manage your users here!</p>
              </div>
            )
          }
          {
            steps === "blogs" && (
              <div className="dashboard-content-form">
                <h4 className='text-center text-success'>{isBlogEdit ? "Edit Blog" : "Manage Blogs"}</h4>
                <p className="text-muted text-center" >{isBlogEdit ? "Update your blog details here!" : "Manage your blogs here!"}</p>
                <div className="blog-form mb-4">
                  <input type="text" onChange={handleChange} value={blogForm.blogTitle} className="form-control" name="blogTitle" placeholder="Enter Blog Title" />
                  <input type="file" onChange={handleFileChange} className="form-control" name="blogImage" accept="image/*" />
                  <textarea onChange={handleChange} value={blogForm.blogContent} className="form-control" rows={4} name="blogContent" placeholder="Enter Blog Content" />
                  <div className="d-flex gap-2">
                    <button type="button" onClick={addBlog} className="btn btn-success flex-grow-1">{isBlogEdit ? "Update Blog" : "Add Blog"}</button>
                    {isBlogEdit && (
                      <button type="button" className="btn btn-secondary" onClick={() => {
                        setIsBlogEdit(false);
                        setCurrentBlogId(null);
                        setBlogForm({ blogTitle: "", blogImage: "", blogContent: "" });
                      }}>Cancel</button>
                    )}
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Content</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog.id}>
                          <td className="fw-bold">{blog.blogTitle}</td>
                          <td>
                            <img
                              src={`http://localhost:8000/uploads/${blog.blogImage}`}
                              alt={blog.blogTitle}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </td>
                          <td><small className="text-muted">{blog.blogContent.substring(0, 50)}...</small></td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditBlog(blog)}>
                                <Edit size={16} />
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteBlog(blog.id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "faqs" && (
              <div className="admin-faqs">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Frequently Asked Questions</h4>
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => {
                    setIsFaqEdit(false);
                    setCurrentFaqId(null);
                    setFaqForm({ question: "", answer: "", category: "General" });
                    setOpenFaq(true);
                  }}>
                    <Plus size={18} /> Add New FAQ
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '30%' }}>Question</th>
                        <th>Answer</th>
                        <th style={{ width: '20%' }}>Category</th>
                        <th style={{ width: '15%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((faq) => (
                        <tr key={faq.id}>
                          <td className="fw-bold">{faq.question}</td>
                          <td><small className="text-muted">{faq.answer}</small></td>
                          <td><small className="text-muted">{faq.category}</small></td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditFaq(faq)}>
                                <Edit size={16} />
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteFaq(faq.id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "applications" && (
              <div className="admin-applications">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Manage Applications</h4>
                  <p className="text-muted">Review job applications from candidates</p>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Applicant</th>
                        <th>Job Title</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length > 0 ? (
                        applications.map((application) => (

                          <tr key={application.id}>
                            {
                              console.log(application)
                            }
                            <td>
                              <small className="text-muted">
                                {application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}
                              </small>
                            </td>
                            <td>
                              <div className="fw-bold">{application.name}</div>
                              <small className="text-muted">{application.email} | {application.phone}</small>
                            </td>
                            <td className="fw-bold text-success">{application.jobTitle}</td>
                            <td>
                              <small>{application.city}, {application.state}</small>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {/* <button
                                  className="btn btn-outline-primary btn-sm"
                                  title="View Details"
                                  onClick={() => {
                                    // You can implement a details view here if needed
                                    console.log('View details for:', application);
                                  }}
                                >
                                  <Eye size={16} />
                                </button> */}
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  title="View Resume"
                                  onClick={() => {
                                    if (application.resumeFile) {
                                      window.open(`http://localhost:8000/${application.resumeFile}`, '_blank');
                                    } else if (application.resumeLink) {
                                      const url = application.resumeLink.startsWith('http') ? application.resumeLink : `https://${application.resumeLink}`;
                                      window.open(url, '_blank');
                                    } else {
                                      toast.info("No resume provided");
                                    }
                                  }}
                                >
                                  <FileText size={16} />
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Application"
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this application?')) {
                                      try {
                                        const res = await fetch(`http://localhost:8000/applications/${application.id}`, {
                                          method: 'DELETE'
                                        });
                                        if (res.ok) {
                                          toast.success("Application deleted successfully", {
                                            autoClose: 800,
                                            position: "bottom-center"
                                          });
                                          getApplications();
                                        }
                                      } catch (err) {
                                        toast.error("Failed to delete application", {
                                          autoClose: 800,
                                          position: "bottom-center"
                                        });
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "contacts" && (
              <div className="admin-contacts">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Contact Messages</h4>
                  <p className="text-muted">Review messages from customers</p>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td><small>{new Date(contact.createdAt).toLocaleString()}</small></td>
                          <td>
                            <div className="fw-bold">{contact.name}</div>
                            <small className="text-muted">{contact.email}</small>
                          </td>
                          <td className="fw-bold text-success">{contact.subject}</td>
                          <td><small className="text-muted">{contact.message}</small></td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteContact(contact.id)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          {
            steps === "terms" && (
              <div className="dashboard-content-form">
                <h4>Terms and Conditions</h4>
                <p className="text-muted">Manage your terms and conditions here!</p>
              </div>
            )
          }
          {
            steps === "logout" && (
              <div className="dashboard-content-form">
                <h4>Logout</h4>
                <p className="text-muted">Logout from the admin panel!</p>
              </div>
            )
          }
        </div>
      </div>

      <Modal open={openCat} onClose={() => setOpenCat(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Add New Category
          </Typography>
          <form onSubmit={handleAddCategory}>
            <div className="mb-3">
              <TextField fullWidth label="Category Name" name="name" value={catForm.name} onChange={handleCatChange} required size="small" />
            </div>
            <div className="mb-3">
              <TextField fullWidth label="Category Slug (URL)" name="slug" value={catForm.slug} onChange={handleCatChange} required size="small" placeholder="e.g. fruits-vegetables" />
            </div>
            <div className="mb-3">
              <TextField fullWidth label="Icon (Emoji)" name="icon" value={catForm.icon} onChange={handleCatChange} required size="small" />
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">Add Category</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenCat(false)}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal open={openFaq} onClose={() => setOpenFaq(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {isFaqEdit ? "Edit FAQ" : "Add New FAQ"}
          </Typography>
          <form onSubmit={handleAddFaq}>
            <div className="mb-3">
              <TextField fullWidth label="Question" name="question" value={faqForm.question} onChange={handleFaqChange} required size="small" multiline rows={2} />
            </div>
            <div className="mb-3">
              <TextField fullWidth label="Answer" name="answer" value={faqForm.answer} onChange={handleFaqChange} required size="small" multiline rows={4} />
            </div>
            <div className="mb-3">
              <TextField fullWidth label="Category" name="category" value={faqForm.category} onChange={handleFaqChange} required size="small" />
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">{isFaqEdit ? "Update FAQ" : "Add FAQ"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenFaq(false)}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>


      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {isEdit ? "Edit Product" : "Add New Product"}
          </Typography>
          <form onSubmit={handleAddItem}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Product ID" name="id" value={itemForm.id} onChange={handleItemChange} required size="small" disabled={isEdit} />
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Product Name" name="name" value={itemForm.name} onChange={handleItemChange} required size="small" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Quantity (e.g. 500g)" name="qty" value={itemForm.qty} onChange={handleItemChange} required size="small" />
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Icon (Emoji)" name="icon" value={itemForm.icon} onChange={handleItemChange} required size="small" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Price" name="price" type="number" value={itemForm.price} onChange={handleItemChange} required size="small" />
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Old Price" name="oldPrice" type="number" value={itemForm.oldPrice} onChange={handleItemChange} size="small" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Offer (e.g. 10% OFF)" name="offer" value={itemForm.offer} onChange={handleItemChange} size="small" />
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Tag (e.g. Bestseller)" name="tag" value={itemForm.tag} onChange={handleItemChange} size="small" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={itemForm.category}
                    label="Category"
                    onChange={handleItemChange}
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>{cat.icon} {cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Sub-Category" name="subCategory" value={itemForm.subCategory} onChange={handleItemChange} size="small" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Delivery Time" name="delivery" value={itemForm.delivery} onChange={handleItemChange} size="small" />
              </div>
              <div className="col-md-6 mb-3">
                <TextField fullWidth label="Stock Status" name="stock" value={itemForm.stock} onChange={handleItemChange} size="small" placeholder="Available" />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">{isEdit ? "Update Product" : "Add Product"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default Admin