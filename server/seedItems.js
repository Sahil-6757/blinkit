const { Sequelize, DataTypes } = require('sequelize');

// MySQL Connection
const sequelize = new Sequelize('blinkit_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

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

const products = [
    {
      id: "p1",
      name: "Fresh Banana - Robusta",
      qty: "1 dozen",
      price: 39,
      oldPrice: 49,
      offer: "20% OFF",
      tag: "Bestseller",
      icon: "🍌",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Fruits",
    },
    {
      id: "p2",
      name: "Amul Taaza Toned Milk",
      qty: "500 ml",
      price: 25,
      icon: "🥛",
      tag: "Bestseller",
      category: "Dairy, Bread & Eggs",
      subCategory: "Milk",
    },
    {
      id: "p3",
      name: "Lay's Classic Salted",
      qty: "52 g",
      price: 20,
      icon: "🥔",
      tag: "Bestseller",
      category: "Snacks & Munchies",
      subCategory: "Chips & Crisps",
    },
    {
      id: "p4",
      name: "Bisleri Water",
      qty: "1 L",
      price: 20,
      icon: "💧",
      tag: "Bestseller",
      category: "Cold Drinks & Juices",
      subCategory: "Water",
    },
    {
      id: "p5",
      name: "Maggi 2-Minute Noodles",
      qty: "70 g",
      price: 14,
      icon: "🍜",
      tag: "Bestseller",
      category: "Breakfast & Instant Food",
      subCategory: "Instant Noodles",
    },
    {
      id: "p6",
      name: "Tata Tea Gold",
      qty: "500 g",
      price: 195,
      oldPrice: 225,
      offer: "13% OFF",
      icon: "☕",
      tag: "Bestseller",
      category: "Tea, Coffee & Drinks",
      subCategory: "Tea",
    },
];

const Fruits_vegetables = [
    {
      id: "f1",
      name: "Fresh Banana - Robusta",
      qty: "1 dozen",
      price: 39,
      oldPrice: 49,
      offer: "20% OFF",
      delivery: "8 min",
      icon: "🍌",
      tag: "Bestseller",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Fruits",
    },
    {
      id: "f2",
      name: "Tomato - Hybrid",
      qty: "500 g",
      price: 29,
      delivery: "8 min",
      icon: "🍅",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Vegetables",
    },
    {
      id: "f3",
      name: "Onion",
      qty: "1 kg",
      price: 35,
      oldPrice: 45,
      offer: "22% OFF",
      delivery: "8 min",
      icon: "🧅",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Vegetables",
    },
    {
      id: "f4",
      name: "Apple - Shimla",
      qty: "4 pcs",
      price: 149,
      oldPrice: 179,
      offer: "17% OFF",
      delivery: "8 min",
      icon: "🍎",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Fruits",
    },
    {
      id: "f5",
      name: "Potato",
      qty: "1 kg",
      price: 32,
      delivery: "8 min",
      icon: "🥔",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Vegetables",
    },
    {
      id: "f6",
      name: "Green Capsicum",
      qty: "250 g",
      price: 28,
      oldPrice: 35,
      offer: "20% OFF",
      delivery: "8 min",
      icon: "🫑",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Vegetables",
    },
    {
      id: "f7",
      name: "Watermelon - Kiran",
      qty: "1 pc (1.5-2 kg)",
      price: 49,
      delivery: "10 min",
      icon: "🍉",
      category: "Fruits & Vegetables",
      subCategory: "Fresh Fruits",
    },
    {
      id: "f8",
      name: "Coriander Leaves",
      qty: "100 g",
      price: 15,
      delivery: "8 min",
      icon: "🌿",
      category: "Fruits & Vegetables",
      subCategory: "Herbs & Seasonings",
    },
];

const DailyBread = [
    {
      id: "d1",
      name: "Amul Taaza Toned Milk",
      qty: "500 ml",
      price: 25,
      delivery: "8 min",
      icon: "🥛",
      tag: "Bestseller",
      category: "Dairy, Bread & Eggs",
      subCategory: "Milk",
    },
    {
      id: "d2",
      name: "Amul Butter",
      qty: "100 g",
      price: 56,
      delivery: "8 min",
      icon: "🧈",
      category: "Dairy, Bread & Eggs",
      subCategory: "Butter & Spread",
    },
    {
      id: "d3",
      name: "Brown Bread",
      qty: "400 g",
      price: 42,
      delivery: "8 min",
      icon: "🍞",
      category: "Dairy, Bread & Eggs",
      subCategory: "Bread",
    },
    {
      id: "d4",
      name: "Farm Eggs - Pack of 6",
      qty: "6 pcs",
      price: 45,
      oldPrice: 55,
      offer: "18% OFF",
      delivery: "8 min",
      icon: "🥚",
      category: "Dairy, Bread & Eggs",
      subCategory: "Eggs",
    },
    {
      id: "d5",
      name: "Amul Cheese Slices",
      qty: "200 g",
      price: 120,
      oldPrice: 140,
      offer: "14% OFF",
      delivery: "8 min",
      icon: "🧀",
      category: "Dairy, Bread & Eggs",
      subCategory: "Cheese",
    },
    {
      id: "d6",
      name: "Greek Yogurt - Plain",
      qty: "400 g",
      price: 89,
      delivery: "10 min",
      icon: "🥣",
      stock: "out",
      category: "Dairy, Bread & Eggs",
      subCategory: "Yogurt",
    },
];

const snacks = [
    {
      id: "s1",
      name: "Lay's Classic Salted",
      qty: "52 g",
      price: 20,
      delivery: "8 min",
      icon: "🥔",
      tag: "Bestseller",
      category: "Snacks & Munchies",
      subCategory: "Chips & Crisps",
    },
    {
      id: "s2",
      name: "Haldiram's Aloo Bhujia",
      qty: "200 g",
      price: 75,
      oldPrice: 85,
      offer: "12% OFF",
      delivery: "8 min",
      icon: "🍿",
      category: "Snacks & Munchies",
      subCategory: "Namkeen",
    },
    {
      id: "s3",
      name: "Dark Fantasy Choco Fills",
      qty: "75 g",
      price: 40,
      delivery: "8 min",
      icon: "🍪",
      category: "Snacks & Munchies",
      subCategory: "Biscuits & Cookies",
    },
    {
      id: "s4",
      name: "Cadbury Dairy Milk Silk",
      qty: "60 g",
      price: 85,
      oldPrice: 95,
      offer: "11% OFF",
      delivery: "8 min",
      icon: "🍫",
      category: "Snacks & Munchies",
      subCategory: "Chocolates",
    },
    {
      id: "s5",
      name: "Almonds - Premium",
      qty: "200 g",
      price: 199,
      oldPrice: 249,
      offer: "20% OFF",
      delivery: "10 min",
      icon: "🥜",
      category: "Snacks & Munchies",
      subCategory: "Dry Fruits",
    },
];

const tea = [
    {
      id: "t1",
      name: "Tata Tea Gold",
      qty: "500 g",
      price: 195,
      oldPrice: 225,
      offer: "13% OFF",
      delivery: "8 min",
      icon: "☕",
      tag: "Bestseller",
      category: "Tea, Coffee & Drinks",
      subCategory: "Tea",
    },
    {
      id: "t2",
      name: "Nescafé Classic",
      qty: "200 g",
      price: 245,
      delivery: "8 min",
      icon: "☕",
      category: "Tea, Coffee & Drinks",
      subCategory: "Coffee",
    },
];

const cleaning = [
    {
      id: "c1",
      name: "Surf Excel Easy Wash",
      qty: "1 kg",
      price: 110,
      oldPrice: 130,
      offer: "15% OFF",
      delivery: "10 min",
      icon: "🧹",
      category: "Cleaning Essentials",
      subCategory: "Laundry",
    },
    {
      id: "c2",
      name: "Vim Dishwash Gel",
      qty: "500 ml",
      price: 99,
      delivery: "10 min",
      icon: "🧽",
      category: "Cleaning Essentials",
      subCategory: "Dishwash",
    },
];

const allData = [
    ...products,
    ...Fruits_vegetables,
    ...DailyBread,
    ...snacks,
    ...tea,
    ...cleaning
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL...');
    
    await sequelize.sync({ alter: true });
    
    // Clear existing items
    await Item.destroy({ where: {}, truncate: false });
    console.log('Cleared existing items.');

    // Insert new items
    await Item.bulkCreate(allData);
    console.log(`Successfully added ${allData.length} items to the database.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
