import mongoose from 'mongoose';
import { storage } from './storage-mongodb';
import { Types } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Acharam';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

const categories = [
  {
    name: 'Spices',
    slug: 'spices',
    description: 'Aromatic spices for your kitchen',
    imageUrl: '/images/categories/spices.jpg'
  },
  {
    name: 'Grains',
    slug: 'grains',
    description: 'Healthy and nutritious grains',
    imageUrl: '/images/categories/grains.jpg'
  },
  {
    name: 'Oils',
    slug: 'oils',
    description: 'Pure and natural cooking oils',
    imageUrl: '/images/categories/oils.jpg'
  }
];

const products = [
  {
    name: 'Turmeric Powder',
    slug: 'turmeric-powder',
    description: 'Pure organic turmeric powder with high curcumin content',
    basePrice: 25000, // 250.00 INR in paise
    stock: 100,
    isActive: true,
    isFeatured: true,
    images: ['/images/products/turmeric-powder.jpg'],
    weight: 200, // in grams
    ingredients: ['Organic Turmeric'],
    shelfLife: 365 // days
  },
  {
    name: 'Basmati Rice',
    slug: 'basmati-rice',
    description: 'Premium quality basmati rice, aged for perfect texture',
    basePrice: 12000, // 120.00 INR in paise
    stock: 50,
    isActive: true,
    isFeatured: true,
    images: ['/images/products/basmati-rice.jpg'],
    weight: 5000, // in grams (5kg)
    shelfLife: 540 // days
  },
  {
    name: 'Coconut Oil',
    slug: 'coconut-oil',
    description: 'Cold pressed virgin coconut oil for cooking and hair care',
    basePrice: 40000, // 400.00 INR in paise
    stock: 75,
    isActive: true,
    isFeatured: true,
    images: ['/images/products/coconut-oil.jpg'],
    weight: 1000, // in ml (1 liter)
    shelfLife: 730 // days
  },
  {
    name: 'Red Chilli Powder',
    slug: 'red-chilli-powder',
    description: 'Spicy and aromatic red chilli powder',
    basePrice: 18000, // 180.00 INR in paise
    stock: 120,
    isActive: true,
    isFeatured: false,
    images: ['/images/products/red-chilli-powder.jpg'],
    weight: 200, // in grams
    shelfLife: 365 // days
  },
  {
    name: 'Toor Dal',
    slug: 'toor-dal',
    description: 'High protein toor dal for daily cooking',
    basePrice: 15000, // 150.00 INR in paise
    stock: 80,
    isActive: true,
    isFeatured: false,
    images: ['/images/products/toor-dal.jpg'],
    weight: 1000, // in grams (1kg)
    shelfLife: 540 // days
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data (be careful with this in production!)
    console.log('🗑️  Clearing existing data...');
    await mongoose.connection.dropDatabase();
    
    // Create categories
    console.log('📝 Creating categories...');
    const createdCategories = [];
    for (const category of categories) {
      try {
        const created = await storage.createCategory(category);
        createdCategories.push(created);
        console.log(`✅ Created category: ${created.name}`);
      } catch (error) {
        const err = error as Error;
        console.error(`❌ Error creating category ${category.name}:`, err.message);
        throw err; // Stop execution if we can't create a category
      }
    }
    
    // Create products
    console.log('📦 Creating products...');
    for (let i = 0; i < products.length; i++) {
      try {
        const product = {
          ...products[i],
          // Assign products to categories in a round-robin fashion
          category: createdCategories[i % createdCategories.length]._id
        };
        const created = await storage.createProduct(product);
        console.log(`✅ Created product: ${created.name} (${(created.basePrice / 100).toFixed(2)} INR)`);
      } catch (error) {
        const err = error as Error;
        console.error(`❌ Error creating product ${products[i].name}:`, err.message);
        throw err; // Stop execution if we can't create a product
      }
    }
    
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
