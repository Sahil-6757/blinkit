const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL Connection with Sequelize
// Note: Replace 'root' and 'password' with your actual MySQL credentials
const sequelize = new Sequelize('blinkit_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// User Model
const User = sequelize.define('User', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  gender: { type: DataTypes.STRING, allowNull: true }
});

// Address Model
const Address = sequelize.define('Address', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  zip: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Order Model
const Order = sequelize.define('Order', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.STRING, allowNull: false, unique: true },
  date: { type: DataTypes.DATEONLY, defaultValue: Sequelize.NOW },
  items: { type: DataTypes.JSON, allowNull: false },
  itemCount: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }
});

// Relationships
User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Item Model
const Item = sequelize.define('Item', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  qty: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  oldPrice: { type: DataTypes.DECIMAL(10, 2) },
  offer: { type: DataTypes.STRING },
  tag: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, allowNull: false },
  subCategory: { type: DataTypes.STRING },
  delivery: { type: DataTypes.STRING },
  stock: { type: DataTypes.STRING }
});



// Application Model (Career)
const Application = sequelize.define('Application', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  jobTitle: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  zip: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  resumeLink: { type: DataTypes.TEXT, allowNull: false },
  resumeFile: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: true
});

// Category Model
const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  icon: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  showInFooter: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true
});

const Blog = sequelize.define('Blog', {
  blogTitle: { type: DataTypes.STRING, allowNull: false },
  blogImage: { type: DataTypes.STRING, allowNull: false },
  blogContent: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: false
});

const Contact = sequelize.define('Contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'contacts', // Use lowercase table name
  timestamps: true
});

// FAQ Model
const FAQ = sequelize.define('FAQ', {
  question: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'General' } // New category field
}, {
  timestamps: false
});

// Sync Database
async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    // ❌ REMOVE alter:true (causing duplicate indexes)
    // await sequelize.sync({ alter: true });

    // ✅ SAFE SYNC
    await sequelize.sync();
    console.log('✅ Database synced successfully');

    // Ensure showInFooter column exists in Categories table
    const [categoryTable] = await sequelize.query("SHOW COLUMNS FROM Categories LIKE 'showInFooter'");
    if (categoryTable.length === 0) {
      await sequelize.query("ALTER TABLE Categories ADD COLUMN showInFooter TINYINT(1) DEFAULT 1");
      console.log('✅ Added showInFooter column to Categories table');
    }

    // Ensure category column exists in FAQs table
    const [faqTable] = await sequelize.query("SHOW COLUMNS FROM FAQs LIKE 'category'");
    if (faqTable.length === 0) {
      await sequelize.query("ALTER TABLE FAQs ADD COLUMN category VARCHAR(255) DEFAULT 'General'");
      console.log('✅ Added category column to FAQs table');
    }

    // Ensure contacts table exists (optional safety)
    const [results] = await sequelize.query("SHOW TABLES LIKE 'contacts'");
    if (results.length === 0) {
      await sequelize.query(`
        CREATE TABLE contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Contacts table created');
    }

  } catch (error) {
    console.error('❌ DB Connection Error:', error);
  }
}
initDB();

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { fullName, email, username, password, confirmPassword, phone, gender } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Only @gmail.com emails are allowed' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ fullName, email, username, password, phone, gender });
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post("/blogs", upload.single('blogImage'), async (req, res) => {
  try {
    const { blogTitle, blogContent } = req.body;
    const blogImage = req.file ? req.file.filename : null;

    if (!blogTitle || !blogImage || !blogContent) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const newBlog = await Blog.create({ blogTitle, blogImage, blogContent });
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.destroy({ where: { id } });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/blogs/:id', upload.single('blogImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { blogTitle, blogContent } = req.body;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const updatedData = { blogTitle, blogContent };
    if (req.file) {
      updatedData.blogImage = req.file.filename;
    }

    await blog.update(updatedData);
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Items Endpoint
app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const { id, name, qty, price, oldPrice, offer, tag, icon, category, subCategory, delivery, stock } = req.body;
    const newItem = await Item.create({ id, name, qty, price, oldPrice, offer, tag, icon, category, subCategory, delivery, stock });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Item.destroy({ where: { id } });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
      include: [Address, Order]
    });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        addresses: user.Addresses,
        orders: user.Orders
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Profile Update Endpoint
app.put('/user/:username', async (req, res) => {
  const { username } = req.params;
  const { fullName, email, phone, gender } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ fullName, email, phone, gender });
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Addresses Endpoints
app.get('/addresses/:userId', async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.params.userId } });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/addresses', async (req, res) => {
  try {
    const { userId, title, address, city, state, zip, country, isDefault } = req.body;
    console.log('Incoming address request:', { userId, title, address, city, state, zip, country, isDefault });

    if (!userId) {
      console.log('Address creation failed: userId is missing');
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await Address.create({
      userId,
      title,
      address,
      city: city || null,
      state: state || null,
      zip: zip || null,
      country: country || null,
      isDefault
    });
    console.log('Address created successfully:', newAddress.id);
    res.status(201).json(newAddress);
  } catch (err) {
    console.error('Error in POST /addresses:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/addresses/:id', async (req, res) => {
  try {
    await Address.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Orders Endpoints
app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.params.userId } });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Orders Endpoint
app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, include: Address, attributes: ['fullName', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/admin/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.update({ status });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { userId, orderId, items, itemCount, address, price } = req.body;
    const newOrder = await Order.create({ userId, orderId, items, itemCount, address, price });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.destroy();
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Careers Endpoints
app.get('/applications', async (req, res) => {
  try {
    const applications = await Application.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Application.destroy({ where: { id } });
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/careers', upload.single('resumePdf'), async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
      resumeFile: req.file ? req.file.path : null
    };
    const application = await Application.create(applicationData);
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Error in POST /careers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Category Endpoints
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
    console.log(categories)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ where: { slug } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const { name, icon, slug } = req.body;
    const existingCategory = await Category.findOne({
      where: {
        [Op.or]: [{ name }, { slug }]
      }
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category or slug already exists' });
    }
    const newCategory = await Category.create({ name, icon, slug });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// FAQ Endpoints
app.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/faqs', async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    console.log('Creating FAQ:', { question, answer, category });
    const newFaq = await FAQ.create({ question, answer, category });
    res.status(201).json(newFaq);
  } catch (err) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const newContact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', contact: newContact });
  } catch (err) {
    console.error('Error in POST /contact:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.destroy({ where: { id } });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.destroy({ where: { id } });
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    await faq.update({ question, answer, category });
    res.status(200).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
