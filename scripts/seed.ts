// Seed script to populate database with initial data
import { storage } from "../server/storage";
import bcrypt from "bcrypt";

// Image file paths
const mangoImage = "/attached_assets/generated_images/Mango_pickle_product_photo_23eaba3f.png";
const mixedImage = "/attached_assets/generated_images/Mixed_vegetable_pickle_photo_97eff0bc.png";
const lemonImage = "/attached_assets/generated_images/Lemon_pickle_product_photo_65120c52.png";
const garlicImage = "/attached_assets/generated_images/Garlic_pickle_product_photo_05c2d9d6.png";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create admin user
    console.log("Creating admin user...");
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const admin = await storage.createUser({
      email: "admin@acharam.com",
      password: hashedAdminPassword,
      name: "Admin User",
      role: "ADMIN",
    });
    console.log(`✓ Admin user created: ${admin.email}`);

    // Create customer user
    console.log("Creating customer user...");
    const hashedCustomerPassword = await bcrypt.hash("customer123", 10);
    const customer = await storage.createUser({
      email: "customer@example.com",
      password: hashedCustomerPassword,
      name: "Priya Sharma",
      role: "CUSTOMER",
    });
    console.log(`✓ Customer user created: ${customer.email}`);

    // Create categories
    console.log("Creating categories...");
    const mangoCategory = await storage.createCategory({
      name: "Mango Pickle",
      slug: "mango-pickle",
      description: "Traditional mango pickles made with raw mangoes and aromatic spices",
      imageUrl: mangoImage,
    });

    const mixedCategory = await storage.createCategory({
      name: "Mixed Pickle",
      slug: "mixed-pickle",
      description: "Assorted vegetable pickles with a perfect blend of flavors",
      imageUrl: mixedImage,
    });

    const lemonCategory = await storage.createCategory({
      name: "Lemon Pickle",
      slug: "lemon-pickle",
      description: "Tangy lemon pickles that add zest to every meal",
      imageUrl: lemonImage,
    });

    const garlicCategory = await storage.createCategory({
      name: "Garlic Pickle",
      slug: "garlic-pickle",
      description: "Spicy garlic pickles for garlic lovers",
      imageUrl: garlicImage,
    });
    console.log("✓ Categories created");

    // Create products
    console.log("Creating products...");
    
    const mangoProduct = await storage.createProduct({
      name: "Traditional Mango Pickle",
      slug: "traditional-mango-pickle",
      description: "Our signature mango pickle is made using the finest raw mangoes, blended with aromatic spices and aged to perfection. This traditional recipe has been passed down through generations, ensuring an authentic taste that brings back memories of home-cooked meals.",
      categoryId: mangoCategory.id,
      basePrice: 29900, // ₹299 in paise
      stock: 50,
      isActive: true,
      isFeatured: true,
    });

    const mixedProduct = await storage.createProduct({
      name: "Mixed Vegetable Pickle",
      slug: "mixed-vegetable-pickle",
      description: "A delightful combination of carrots, cauliflower, green chilies, and other fresh vegetables marinated in mustard oil and traditional spices. Perfect for those who love variety in every bite.",
      categoryId: mixedCategory.id,
      basePrice: 24900,
      stock: 30,
      isActive: true,
      isFeatured: true,
    });

    const lemonProduct = await storage.createProduct({
      name: "Tangy Lemon Pickle",
      slug: "tangy-lemon-pickle",
      description: "Bright yellow lemons preserved in a spicy red chili oil mixture. The perfect balance of tanginess and spice that complements rice, roti, and paratha beautifully.",
      categoryId: lemonCategory.id,
      basePrice: 19900,
      stock: 45,
      isActive: true,
      isFeatured: true,
    });

    const garlicProduct = await storage.createProduct({
      name: "Spicy Garlic Pickle",
      slug: "spicy-garlic-pickle",
      description: "Whole garlic cloves marinated in fiery red chili oil and traditional spices. A must-have for garlic lovers who enjoy bold flavors with their meals.",
      categoryId: garlicCategory.id,
      basePrice: 27900,
      stock: 20,
      isActive: true,
      isFeatured: false,
    });

    console.log("✓ Products created");

    // Create product images
    console.log("Creating product images...");
    await storage.createProductImage({
      productId: mangoProduct.id,
      url: mangoImage,
      altText: "Traditional Mango Pickle",
      isPrimary: true,
      sortOrder: 0,
    });

    await storage.createProductImage({
      productId: mixedProduct.id,
      url: mixedImage,
      altText: "Mixed Vegetable Pickle",
      isPrimary: true,
      sortOrder: 0,
    });

    await storage.createProductImage({
      productId: lemonProduct.id,
      url: lemonImage,
      altText: "Tangy Lemon Pickle",
      isPrimary: true,
      sortOrder: 0,
    });

    await storage.createProductImage({
      productId: garlicProduct.id,
      url: garlicImage,
      altText: "Spicy Garlic Pickle",
      isPrimary: true,
      sortOrder: 0,
    });

    console.log("✓ Product images added");

    // Create product variants
    console.log("Creating product variants...");
    
    // Mango pickle variants
    await storage.createProductVariant({
      productId: mangoProduct.id,
      name: "250g",
      price: 19900,
      stock: 30,
      isActive: true,
    });

    await storage.createProductVariant({
      productId: mangoProduct.id,
      name: "500g",
      price: 29900,
      stock: 50,
      isActive: true,
    });

    await storage.createProductVariant({
      productId: mangoProduct.id,
      name: "1kg",
      price: 49900,
      stock: 20,
      isActive: true,
    });

    // Mixed vegetable variants
    await storage.createProductVariant({
      productId: mixedProduct.id,
      name: "250g",
      price: 14900,
      stock: 20,
      isActive: true,
    });

    await storage.createProductVariant({
      productId: mixedProduct.id,
      name: "500g",
      price: 24900,
      stock: 30,
      isActive: true,
    });

    // Lemon pickle variants
    await storage.createProductVariant({
      productId: lemonProduct.id,
      name: "250g",
      price: 12900,
      stock: 25,
      isActive: true,
    });

    await storage.createProductVariant({
      productId: lemonProduct.id,
      name: "500g",
      price: 19900,
      stock: 45,
      isActive: true,
    });

    // Garlic pickle variants
    await storage.createProductVariant({
      productId: garlicProduct.id,
      name: "250g",
      price: 17900,
      stock: 15,
      isActive: true,
    });

    await storage.createProductVariant({
      productId: garlicProduct.id,
      name: "500g",
      price: 27900,
      stock: 20,
      isActive: true,
    });

    console.log("✓ Product variants added");

    // Create sample reviews
    console.log("Creating sample reviews...");
    await storage.createReview({
      productId: mangoProduct.id,
      userId: customer.id,
      rating: 5,
      comment: "Absolutely amazing! Tastes just like my grandmother's recipe. The perfect balance of spices and tanginess.",
    });

    await storage.createReview({
      productId: lemonProduct.id,
      userId: customer.id,
      rating: 5,
      comment: "Best lemon pickle I've ever bought online. Fresh, authentic, and delivered perfectly packaged.",
    });

    console.log("✓ Sample reviews added");

    // Create a sample coupon
    console.log("Creating sample coupon...");
    await storage.createCoupon({
      code: "WELCOME10",
      description: "10% off on your first order",
      discountPercent: 10,
      maxDiscount: 10000, // ₹100 max discount
      minOrderAmount: 30000, // ₹300 minimum
      isActive: true,
      usageLimit: 100,
    });

    console.log("✓ Sample coupon created");

    // Create customer address
    console.log("Creating sample address...");
    await storage.createAddress({
      userId: customer.id,
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      addressLine1: "123 MG Road",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    });

    console.log("✓ Sample address created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nTest Credentials:");
    console.log("Admin: admin@acharam.com / admin123");
    console.log("Customer: customer@example.com / customer123");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
