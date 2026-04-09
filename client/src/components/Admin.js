import { useState, useEffect } from 'react'
import { BoxIcon, Plus, Trash2, CheckCircle, Truck, XCircle, ShoppingBag, Layers, ListIcon, LayersIcon, ListOrderedIcon, UserIcon, UserCheck, UserCheckIcon, UserCheck2Icon, LogOutIcon, RssIcon, Edit, FileText, Shield } from 'lucide-react';
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
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [terms, setTerms] = useState("");
  const [allPermissions, setAllPermissions] = useState({});
  const [permissionsList, setPermissionsList] = useState([]);
  const [openPermModal, setOpenPermModal] = useState(false);
  const [permForm, setPermForm] = useState({ key: "", label: "", category: "General" });
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.username.toLowerCase() === 'admin') return;
      const res = await fetch(`http://localhost:8000/admin/users/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...data, role: data.Role };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Profile sync failed", err);
    }
  };



  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [openFaq, setOpenFaq] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "General" });
  const [isFaqEdit, setIsFaqEdit] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
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

  const [openUserModal, setOpenUserModal] = useState(false);
  const [isUserEdit, setIsUserEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({
    name: "",
    displayName: "",
    description: ""
  });
  const [adminUserForm, setAdminUserForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    gender: "",
    roleId: "",
    post: ""
  });

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

    const isStaff = user?.username?.toLowerCase() === 'admin' || !!user?.role || !!user?.post;

    if (!isAdmin || !user || !isStaff) {
      navigate('/login');
      return;
    }

    fetchUserProfile();
    fetchOrders();
    fetchItems();
    fetchCategories();
    fetchFaqs();
    fetchBlogs();
    fetchContacts();
    fetchUsers();
    fetchRoles();
    fetchTerms();
    fetchPermissions();
  }, [navigate]);

  const fetchPermissions = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/permissions');
      if (res.ok) {
        const data = await res.json();
        setAllPermissions(data);
      }
      
      const listRes = await fetch('http://localhost:8000/admin/permissions/list');
      if (listRes.ok) {
        const listData = await listRes.json();
        setPermissionsList(listData);
      }
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleAddPermission = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Permission added successfully");
        setPermForm({ key: "", label: "", category: "General" });
        setOpenPermModal(false);
        fetchPermissions();
      } else {
        toast.error(data.message || "Failed to add permission");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const deletePermission = async (id) => {
    if (window.confirm("Are you sure you want to delete this permission? This may affect existing roles.")) {
      try {
        const res = await fetch(`http://localhost:8000/admin/permissions/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("Permission deleted");
          fetchPermissions();
        }
      } catch (err) {
        toast.error("Failed to delete permission");
      }
    }
  };

  const fetchTerms = async () => {
    try {
      const res = await fetch('http://localhost:8000/terms');
      if (res.ok) {
        const data = await res.json();
        if (data && data.terms) {
          setTerms(data.terms);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch terms");
    }
  };

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

  const fetchRoles = async () => {
    try {
      const res = await fetch('http://localhost:8000/roles');
      if (res.ok) {
        const data = await res.json();
        const parsedRoles = (Array.isArray(data) ? data : []).map(role => ({
          ...role,
          permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : (Array.isArray(role.permissions) ? role.permissions : [])
        }));
        setRoles(parsedRoles);
      } else {
        setRoles([]);
      }
    } catch (err) {
      toast.error("Failed to fetch roles", {
        autoClose: 800,
        position: "bottom-center"
      });
      setRoles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/users');
      if (res.ok) {
        const data = await res.json();
        const parsedUsers = (Array.isArray(data) ? data : []).map(user => {
          if (user.Role) {
            return {
              ...user,
              Role: {
                ...user.Role,
                permissions: typeof user.Role.permissions === 'string' ? JSON.parse(user.Role.permissions) : (Array.isArray(user.Role.permissions) ? user.Role.permissions : [])
              }
            };
          }
          return user;
        });
        setUsers(parsedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      toast.error("Failed to fetch users", {
        autoClose: 800,
        position: "bottom-center"
      });
      setUsers([]);
    }
  };

  const openPermissions = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(Array.isArray(role.permissions) ? role.permissions : []);
  };

  const togglePermission = (permKey) => {
    setSelectedPermissions(prev =>
      prev.includes(permKey)
        ? prev.filter(p => p !== permKey)
        : [...prev, permKey]
    );
  };

  const savePermissions = async () => {
    try {
      const res = await fetch(`http://localhost:8000/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions })
      });
      if (res.ok) {
        toast.success("Permissions updated successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        fetchRoles();
        setSelectedRole(null);
      }
    } catch (err) {
      toast.error("Failed to update permissions", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        const res = await fetch(`http://localhost:8000/admin/users/${user.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success("User deleted successfully", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchUsers();
        } else {
          const data = await res.json();
          toast.error(data.message || "Failed to delete user", {
            autoClose: 800,
            position: "bottom-center"
          });
        }
      } catch (err) {
        toast.error("Server error. Please try again.");
      }
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Role created successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
        setRoleForm({ name: "", displayName: "", description: "" });
        setOpenRoleModal(false);
        fetchRoles();
      } else {
        toast.error(data.message || "Failed to create role");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  const deleteRole = async (role) => {
    if (window.confirm(`Are you sure you want to delete ${role.displayName}?`)) {
      try {
        const url = role.isCustom
          ? `http://localhost:8000/roles/${role.id}?displayName=${encodeURIComponent(role.displayName)}`
          : `http://localhost:8000/roles/${role.id}`;

        const res = await fetch(url, {
          method: 'DELETE'
        });
        const data = await res.json();

        if (res.ok) {
          toast.success(data.message || "Role deleted successfully", {
            autoClose: 800,
            position: "bottom-center"
          });
          fetchRoles();
          fetchUsers(); // Refresh users in case custom post was removed
        } else {
          toast.error(data.message || "Failed to delete role", {
            autoClose: 800,
            position: "bottom-center"
          });
        }
      } catch (err) {
        toast.error("Failed to delete role", {
          autoClose: 800,
          position: "bottom-center"
        });
      }
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

  const handleTermsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/admin/terms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms })
      });
      if (res.ok) {
        toast.success("Terms updated successfully", {
          autoClose: 800,
          position: "bottom-center"
        });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update terms");
      }
    } catch (err) {
      toast.error("Failed to update terms");
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

  const handleTerms = (e) => {
    setTerms(e.target.value);
  }

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

  const handleAddAdminUser = async (e) => {
    e.preventDefault(); // ✅ always first

    const {
      fullName,
      email,
      username,
      password,
      phone,
      gender,
      roleId
    } = adminUserForm;

    // ✅ Required fields check
    if (!fullName || !email || !username || (!isUserEdit && !password) || !phone || !gender || !roleId) {
      return toast.error("All fields are required", {
        autoClose: 800,
        position: "bottom-center"
      });
    }

    // ✅ Full Name (only alphabets + space)
    if (!/^[A-Za-z\s]+$/.test(fullName)) {
      return toast.error("Full Name should contain only alphabets", {
        autoClose: 800,
        position: "bottom-center"
      });
    }

    // ✅ Email (only gmail)
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return toast.error("Only Gmail addresses allowed", {
        autoClose: 800,
        position: "bottom-center"
      });
    }

  

    // ✅ Phone (10 digits + start with 9/8/7/6)
    if (!/^[9876]\d{9}$/.test(phone)) {
      return toast.error("Enter valid 10-digit phone starting with 9/8/7/6", {
        autoClose: 800,
        position: "bottom-center"
      });
    }

    // ✅ Password (min 6 chars) - only check if it's a new user or password is provided for update
    if (!isUserEdit && password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        autoClose: 800,
        position: "bottom-center"
      });
    }
    if (isUserEdit && password && password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        autoClose: 800,
        position: "bottom-center"
      });
    }

    try {
      const url = isUserEdit
        ? `http://localhost:8000/admin/users/${currentUserId}`
        : 'http://localhost:8000/admin/add-user';
      const method = isUserEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminUserForm)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || (isUserEdit ? "User updated successfully" : "User created successfully"), {
          autoClose: 800,
          position: "bottom-center"
        });

        // ✅ Reset form
        setAdminUserForm({
          fullName: "",
          email: "",
          username: "",
          password: "",
          phone: "",
          gender: "",
          roleId: "",
          post: ""
        });

        setOpenUserModal(false);
        setIsUserEdit(false);
        setCurrentUserId(null);
        fetchUsers();
        fetchRoles();
      } else {
        toast.error(data.message || (isUserEdit ? "Failed to update user" : "Failed to create user"));
      }

    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setAdminUserForm({
      fullName: user.fullName || "",
      email: user.email || "",
      username: user.username || "",
      password: "", // Don't show password
      phone: user.phone || "",
      gender: user.gender || "",
      roleId: user.roleId || (user.post ? 'other' : ""),
      post: user.post || ""
    });
    setCurrentUserId(user.id);
    setIsUserEdit(true);
    setOpenUserModal(true);
  };

  const isSuperAdmin = currentUser?.username?.toLowerCase() === 'admin';
  const userPermissions = isSuperAdmin ? [] : (currentUser?.role?.permissions ? (typeof currentUser.role.permissions === 'string' ? JSON.parse(currentUser.role.permissions) : currentUser.role.permissions) : []);

  const hasPermission = (perm) => {
    if (isSuperAdmin) return true;
    return userPermissions.includes(perm);
  };

  return (

    <>
      <div className='Admin-Container'>
        <div className='sidebar'>
          <p className='sidebar-title' onClick={() => setSteps("dashboard")}> <BoxIcon /> Admin Dashboard</p>

          {hasPermission("products_view") && (
            <p className='sidebar-title' onClick={() => setSteps("products")}> <ListIcon /> Manage Products</p>
          )}

          {hasPermission("categories_view") && (
            <p className='sidebar-title' onClick={() => setSteps("categories")}> <LayersIcon /> Manage Categories</p>
          )}

          {hasPermission("orders_view") && (
            <p className='sidebar-title' onClick={() => setSteps("orders")}> <ListOrderedIcon /> Manage Orders</p>
          )}

          {hasPermission("users_view") && (
            <p className='sidebar-title' onClick={() => setSteps("users")}> <UserIcon /> Manage Users</p>
          )}

          {isSuperAdmin && (
            <p className='sidebar-title' onClick={() => setSteps("roles")}> <Shield /> Manage Roles</p>
          )}

          {isSuperAdmin && (
            <p className='sidebar-title' onClick={() => setSteps("permissions")}> <Shield /> Manage Permissions</p>
          )}

          {hasPermission("blogs_manage") && (
            <p className='sidebar-title' onClick={() => setSteps("blogs")}> <RssIcon /> Manage Blogs</p>
          )}

          {hasPermission("faqs_manage") && (
            <p className='sidebar-title' onClick={() => setSteps("faqs")}> <UserCheckIcon /> Manage FAQs</p>
          )}

          {isSuperAdmin && (
            <p className='sidebar-title' onClick={() => setSteps("applications")}> <UserCheckIcon /> Manage Applications</p>
          )}

          {hasPermission("contacts_view") && (
            <p className='sidebar-title' onClick={() => setSteps("contacts")}> <FaCommentDots /> Contact Messages</p>
          )}

          {isSuperAdmin && (
            <p className='sidebar-title' onClick={() => setSteps("terms")}> <UserCheck2Icon /> Terms and Conditions</p>
          )}

          <p className='sidebar-title' style={{ color: "red" }} onClick={() => handleLogout()}> <LogOutIcon /> Logout</p>
        </div>

        <div className='admin-mainContent'>


          {
            steps === "dashboard" && (
              <div className="dashboard-content-form">
                <h4 className="text-center text-success">Admin Dashboard</h4>
                <p className="text-muted text-center">Welcome to the Admin Dashboard!</p>
                <div className='row'>
                  {hasPermission("blogs_manage") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <RssIcon />
                          <p>Blog Posts</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{blogs.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasPermission("products_view") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <ShoppingBag size={24} />
                          <p>Total Items</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{items.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasPermission("categories_view") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <Layers size={24} />
                          <p>Total Categories</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{categories.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasPermission("orders_view") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <BoxIcon size={24} />
                          <p>Total Orders</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{allOrders.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasPermission("faqs_manage") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <ListIcon size={24} />
                          <p>Total FAQs</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{faqs.length}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasPermission("contacts_view") && (
                    <div className='col-md-4 my-2'>
                      <div className='card'>
                        <div className='card-header'>
                          <FaCommentDots size={24} />
                          <p>Total Messages</p>
                          <p className='text-success' style={{ fontSize: "26px", fontWeight: "bold" }}>{contacts.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
                        <th>Message</th>
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
                              <small className="text-muted">{application.message}</small>
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
            steps === "users" && (
              <div className="admin-users">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>Manage Users</h4>
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setOpenUserModal(true)}>
                    <UserCheck size={18} /> Add User
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>User Info</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Permissions</th>
                        <th>Registered On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="fw-bold">{user.fullName}</div>
                              <small className="text-muted">{user.username}</small>
                            </td>
                            <td>
                              <small className="text-muted">{user.email}</small>
                              <small className="text-muted d-block">{user.phone || 'N/A'}</small>
                            </td>
                            <td>
                              {user.Role ? (
                                <>
                                  <div className="fw-bold text-primary">{user.Role.displayName}</div>
                                  <small className="text-muted">{user.Role.description}</small>
                                </>
                              ) : user.post ? (
                                <>
                                  <div className="fw-bold text-success">{user.post}</div>
                                  <small className="text-muted">Custom Designation</small>
                                </>
                              ) : (
                                <span className="">No Role Assigned</span>
                              )}
                            </td>
                            <td>
                              {user.Role && user.Role.permissions && Array.isArray(user.Role.permissions) ? (
                                <span className="badge bg-info text-dark">
                                  {user.Role.permissions.length} Permissions
                                </span>
                              ) : user.post ? (
                                <span className="badge bg-light text-muted">Limited Permissions</span>
                              ) : (
                                <span className="badge bg-light text-muted">0 Permissions</span>
                              )}
                            </td>
                            <td>
                              <small className="text-muted">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {/* Add user-specific actions here, e.g., Edit, Delete, Change Role */}
                                <button className="btn btn-outline-primary" title="Edit User" onClick={() => handleEditUser(user)}>
                                  <Edit size={16} />
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => handleDeleteUser(user)} title="Delete User">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No users found.
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
            steps === "roles" && (
              <div className="admin-role">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex flex-column">
                    <h4>Role Management</h4>
                    <p className="text-muted">Manage system roles and their permissions</p>
                  </div>
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setOpenRoleModal(true)}>
                    <Plus size={18} /> Add Role
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Role Name</th>
                        <th>Display Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.id}>
                          <td><code>{role.name}</code></td>
                          <td>
                            <strong>{role.displayName}</strong>
                            {role.isCustom && <span className="badge bg-success ms-2">Custom</span>}
                          </td>
                          <td><small>{role.description}</small></td>

                          <td>
                            <div className="d-flex gap-2">
                              {!role.isCustom ? (
                                <button className="btn btn-outline-primary btn-sm" onClick={() => openPermissions(role)}>
                                  <Shield size={16} className="me-1" /> Permissions
                                </button>
                              ) : (
                                <button className="btn btn-outline-secondary btn-sm disabled" title="Permissions cannot be managed for custom designations">
                                  <Shield size={16} className="me-1" /> Permissions
                                </button>
                              )}
                              <button className="btn btn-outline-danger btn-sm" onClick={() => deleteRole(role)} title="Delete Role">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Permissions Modal */}
                {selectedRole && (
                  <div className="custom-modal-overlay" onClick={() => setSelectedRole(null)}>
                    <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-header d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Manage Permissions - {selectedRole.displayName}</h5>
                        <button className="btn-close" onClick={() => setSelectedRole(null)}></button>
                      </div>

                      <div className="modal-body">
                        {Object.keys(allPermissions).map((category) => (
                          <div key={category} className="mb-4">
                            <h6 className="border-bottom pb-2 mb-3 text-success">{category}</h6>
                            <div className="row g-3">
                              {allPermissions[category].map((perm) => (
                                <div key={perm.key} className="col-md-6">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={perm.key}
                                      checked={selectedPermissions.includes(perm.key)}
                                      onChange={() => togglePermission(perm.key)}
                                    />
                                    <label className="form-check-label" htmlFor={perm.key}>
                                      {perm.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="modal-footer d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button className="btn btn-secondary" onClick={() => setSelectedRole(null)}>Cancel</button>
                        <button className="btn btn-success" onClick={savePermissions}>
                          Save Changes ({selectedPermissions.length})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          {
            steps === "permissions" && (
              <div className="admin-permissions">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex flex-column">
                    <h4>Permission Management</h4>
                    <p className="text-muted">Define and group system permissions</p>
                  </div>
                  <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setOpenPermModal(true)}>
                    <Plus size={18} /> Add Permission
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Category</th>
                        <th>Permission Key</th>
                        <th>Label</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsList.map((perm) => (
                        <tr key={perm.id}>
                          <td><span className="badge bg-light text-dark">{perm.category}</span></td>
                          <td><code>{perm.key}</code></td>
                          <td>{perm.label}</td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deletePermission(perm.id)}>
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
                <div className='Terms-form'>
                  <div className="mb-3">
                    <label className="form-label">Terms and Conditions</label>
                    <textarea rows={12} className='form-control' value={terms} onChange={handleTerms} />
                  </div>
                  <button className="btn btn-success" onClick={handleTermsSubmit}>Save</button>
                </div>
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

      <Modal open={openPermModal} onClose={() => setOpenPermModal(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Add New Permission
          </Typography>
          <form onSubmit={handleAddPermission}>
            <div className="mb-3">
              <TextField
                fullWidth label="Permission Key" name="key" value={permForm.key}
                onChange={(e) => setPermForm({ ...permForm, key: e.target.value })}
                required size="small" placeholder="e.g. inventory_delete"
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth label="Display Label" name="label" value={permForm.label}
                onChange={(e) => setPermForm({ ...permForm, label: e.target.value })}
                required size="small" placeholder="e.g. Delete Inventory"
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth label="Category" name="category" value={permForm.category}
                onChange={(e) => setPermForm({ ...permForm, category: e.target.value })}
                required size="small" placeholder="e.g. Inventory"
              />
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">Add Permission</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenPermModal(false)}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal open={openRoleModal} onClose={() => setOpenRoleModal(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Add New Role
          </Typography>
          <form onSubmit={handleAddRole}>
            <div className="mb-3">
              <TextField
                fullWidth label="Role Name (Unique ID)" name="name" value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                required size="small" placeholder="e.g. manager"
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth label="Display Name" name="displayName" value={roleForm.displayName}
                onChange={(e) => setRoleForm({ ...roleForm, displayName: e.target.value })}
                required size="small" placeholder="e.g. Store Manager"
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth label="Description" name="description" value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                size="small" multiline rows={2} placeholder="Briefly describe this role"
              />
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">Add Role</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenRoleModal(false)}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal open={openUserModal} onClose={() => {
        setOpenUserModal(false);
        setIsUserEdit(false);
        setCurrentUserId(null);
        setAdminUserForm({
          fullName: "",
          email: "",
          username: "",
          password: "",
          phone: "",
          gender: "",
          roleId: "",
          post: ""
        });
      }}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {isUserEdit ? "Edit Admin User" : "Create Admin User"}
          </Typography>
          <form onSubmit={handleAddAdminUser}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField
                  fullWidth label="Full Name" name="fullName" required size="small"
                  value={adminUserForm.fullName}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, fullName: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <TextField
                  fullWidth label="Username" name="username" required size="small"
                  value={adminUserForm.username}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, username: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField
                  fullWidth label="Email" name="email" required size="small" type="email"
                  value={adminUserForm.email}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, email: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <TextField
                  fullWidth label="Password" name="password" required={!isUserEdit} size="small" type="password"
                  value={adminUserForm.password}
                  placeholder={isUserEdit ? "Leave blank to keep current" : "Enter password"}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, password: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField
                  type='number' fullWidth label="Phone" name="phone" size="small"
                  value={adminUserForm.phone}
                  onChange={(e) => {
                    const value = e.target.value;

                    // First digit 9/8/7/6 + total 10 digits
                    if (/^[9876]?\d{0,9}$/.test(value)) {
                      setAdminUserForm({ ...adminUserForm, phone: value });
                    }
                  }} />
              </div>
              <div className="col-md-6 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    value={adminUserForm.gender}
                    label="Gender"
                    onChange={(e) => setAdminUserForm({ ...adminUserForm, gender: e.target.value })}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="mb-3">
              <FormControl fullWidth size="small" required>
                <InputLabel id="role-label">Assign Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={adminUserForm.roleId}
                  label="Assign Role"
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, roleId: e.target.value })}
                >
                  {roles.filter(role => !role.isCustom).map(role => (
                    <MenuItem key={role.id} value={role.id}>{role.displayName}</MenuItem>
                  ))}
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            {adminUserForm.roleId === 'other' && (
              <div className="mb-3">
                <TextField
                  fullWidth label="Post" name="post" required size="small"
                  placeholder="specify post"
                  value={adminUserForm.post}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, post: e.target.value })}
                />
              </div>
            )}
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success flex-grow-1">{isUserEdit ? "Update User" : "Create User"}</button>
              <button type="button" className="btn btn-secondary" onClick={() => {
                setOpenUserModal(false);
                setIsUserEdit(false);
                setCurrentUserId(null);
                setAdminUserForm({
                  fullName: "",
                  email: "",
                  username: "",
                  password: "",
                  phone: "",
                  gender: "",
                  roleId: "",
                  post: ""
                });
              }}>Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default Admin