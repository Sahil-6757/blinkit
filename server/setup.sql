-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS blinkit_db;
USE blinkit_db;

-- Table for Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Items
CREATE TABLE IF NOT EXISTS Items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    qty VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    oldPrice DECIMAL(10, 2),
    offer VARCHAR(100),
    tag VARCHAR(100),
    icon VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    subCategory VARCHAR(100),
    delivery VARCHAR(100),
    stock VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Blogs
CREATE TABLE IF NOT EXISTS Blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blogTitle VARCHAR(255) NOT NULL,
    blogImage VARCHAR(255) NOT NULL,
    blogContent TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for Contacts
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Initial Items Data
INSERT INTO Items (id, name, qty, price, oldPrice, offer, tag, icon, category, subCategory, delivery, stock) VALUES
('p1', 'Fresh Banana - Robusta', '1 dozen', 39.00, 49.00, '20% OFF', 'Bestseller', '🍌', 'Fruits & Vegetables', 'Fresh Fruits', '8 min', NULL),
('p2', 'Amul Taaza Toned Milk', '500 ml', 25.00, NULL, NULL, 'Bestseller', '🥛', 'Dairy, Bread & Eggs', 'Milk', '8 min', NULL),
('p3', 'Lay\'s Classic Salted', '52 g', 20.00, NULL, NULL, 'Bestseller', '🥔', 'Snacks & Munchies', 'Chips & Crisps', '8 min', NULL),
('p4', 'Bisleri Water', '1 L', 20.00, NULL, NULL, 'Bestseller', '💧', 'Cold Drinks & Juices', 'Water', '8 min', NULL),
('p5', 'Maggi 2-Minute Noodles', '70 g', 14.00, NULL, NULL, 'Bestseller', '🍜', 'Breakfast & Instant Food', 'Instant Noodles', '8 min', NULL),
('p6', 'Tata Tea Gold', '500 g', 195.00, 225.00, '13% OFF', 'Bestseller', '☕', 'Tea, Coffee & Drinks', 'Tea', '8 min', NULL),
('f1', 'Fresh Banana - Robusta', '1 dozen', 39.00, 49.00, '20% OFF', 'Bestseller', '🍌', 'Fruits & Vegetables', 'Fresh Fruits', '8 min', NULL),
('f2', 'Tomato - Hybrid', '500 g', 29.00, NULL, NULL, NULL, '🍅', 'Fruits & Vegetables', 'Fresh Vegetables', '8 min', NULL),
('f3', 'Onion', '1 kg', 35.00, 45.00, '22% OFF', NULL, '🧅', 'Fruits & Vegetables', 'Fresh Vegetables', '8 min', NULL),
('f4', 'Apple - Shimla', '4 pcs', 149.00, 179.00, '17% OFF', NULL, '🍎', 'Fruits & Vegetables', 'Fresh Fruits', '8 min', NULL),
('f5', 'Potato', '1 kg', 32.00, NULL, NULL, NULL, '🥔', 'Fruits & Vegetables', 'Fresh Vegetables', '8 min', NULL),
('f6', 'Green Capsicum', '250 g', 28.00, 35.00, '20% OFF', NULL, '🫑', 'Fruits & Vegetables', 'Fresh Vegetables', '8 min', NULL),
('f7', 'Watermelon - Kiran', '1 pc (1.5-2 kg)', 49.00, NULL, NULL, NULL, '🍉', 'Fruits & Vegetables', 'Fresh Fruits', '10 min', NULL),
('f8', 'Coriander Leaves', '100 g', 15.00, NULL, NULL, NULL, '🌿', 'Fruits & Vegetables', 'Herbs & Seasonings', '8 min', NULL),
('d1', 'Amul Taaza Toned Milk', '500 ml', 25.00, NULL, NULL, 'Bestseller', '🥛', 'Dairy, Bread & Eggs', 'Milk', '8 min', NULL),
('d2', 'Amul Butter', '100 g', 56.00, NULL, NULL, NULL, '🧈', 'Dairy, Bread & Eggs', 'Butter & Spread', '8 min', NULL),
('d3', 'Brown Bread', '400 g', 42.00, NULL, NULL, NULL, '🍞', 'Dairy, Bread & Eggs', 'Bread', '8 min', NULL),
('d4', 'Farm Eggs - Pack of 6', '6 pcs', 45.00, 55.00, '18% OFF', NULL, '🥚', 'Dairy, Bread & Eggs', 'Eggs', '8 min', NULL),
('d5', 'Amul Cheese Slices', '200 g', 120.00, 140.00, '14% OFF', NULL, '🧀', 'Dairy, Bread & Eggs', 'Cheese', '8 min', NULL),
('d6', 'Greek Yogurt - Plain', '400 g', 89.00, NULL, NULL, NULL, '🥣', 'Dairy, Bread & Eggs', 'Yogurt', '10 min', 'out'),
('s1', 'Lay\'s Classic Salted', '52 g', 20.00, NULL, NULL, 'Bestseller', '🥔', 'Snacks & Munchies', 'Chips & Crisps', '8 min', NULL),
('s2', 'Haldiram\'s Aloo Bhujia', '200 g', 75.00, 85.00, '12% OFF', NULL, '🍿', 'Snacks & Munchies', 'Namkeen', '8 min', NULL),
('s3', 'Dark Fantasy Choco Fills', '75 g', 40.00, NULL, NULL, NULL, '🍪', 'Snacks & Munchies', 'Biscuits & Cookies', '8 min', NULL),
('s4', 'Cadbury Dairy Milk Silk', '60 g', 85.00, 95.00, '11% OFF', NULL, '🍫', 'Snacks & Munchies', 'Chocolates', '8 min', NULL),
('s5', 'Almonds - Premium', '200 g', 199.00, 249.00, '20% OFF', NULL, '🥜', 'Snacks & Munchies', 'Dry Fruits', '10 min', NULL),
('t1', 'Tata Tea Gold', '500 g', 195.00, 225.00, '13% OFF', 'Bestseller', '☕', 'Tea, Coffee & Drinks', 'Tea', '8 min', NULL),
('t2', 'Nescafé Classic', '200 g', 245.00, NULL, NULL, NULL, '☕', 'Tea, Coffee & Drinks', 'Coffee', '8 min', NULL),
('c1', 'Surf Excel Easy Wash', '1 kg', 110.00, 130.00, '15% OFF', NULL, '🧹', 'Cleaning Essentials', 'Laundry', '10 min', NULL),
('c2', 'Vim Dishwash Gel', '500 ml', 99.00, NULL, NULL, NULL, '🧽', 'Cleaning Essentials', 'Dishwash', '10 min', NULL);

-- Table for FAQs
CREATE TABLE IF NOT EXISTS FAQs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

-- Table for Categories
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- Table for Addresses
CREATE TABLE IF NOT EXISTS Addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255),
    country VARCHAR(255),
    isDefault BOOLEAN DEFAULT FALSE
);

-- Table for Orders
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    orderId VARCHAR(255) NOT NULL UNIQUE,
    date DATE DEFAULT CURRENT_DATE,
    items JSON NOT NULL,
    itemCount INT NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) DEFAULT 'Pending'
);

-- Table for Applications
CREATE TABLE IF NOT EXISTS Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    jobTitle VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    resumeLink TEXT NOT NULL,
    resumeFile VARCHAR(255),
    message TEXT NOT NULL
);


