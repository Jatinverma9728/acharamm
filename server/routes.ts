import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import session from "express-session";
import { z } from "zod";
import {
  insertUserSchema,
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertAddressSchema,
  insertReviewSchema,
  insertProductImageSchema,
  insertProductVariantSchema,
} from "@shared/schema";

// Initialize Stripe if keys are available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "acharam-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});

// Extend Express session type
declare module "express-session" {
  interface SessionData {
    userId?: string;
    cartSessionId?: string;
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Middleware to check if user is admin
async function requireAdmin(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(sessionMiddleware);

  // ==================== Authentication Routes ====================
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user - force role to CUSTOMER for security (never trust client input for role)
      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "CUSTOMER",
      });

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });

  // ==================== Categories Routes ====================
  
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== Products Routes ====================
  
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, isActive, isFeatured } = req.query;
      
      const filters: any = {};
      if (categoryId) filters.categoryId = categoryId as string;
      if (isActive !== undefined) filters.isActive = isActive === "true";
      if (isFeatured !== undefined) filters.isFeatured = isFeatured === "true";

      const products = await storage.getProducts(filters);
      
      // Get images and variants for each product
      const productsWithDetails = await Promise.all(
        products.map(async (product) => {
          const images = await storage.getProductImages(product.id);
          const variants = await storage.getProductVariants(product.id);
          return { ...product, images, variants };
        })
      );

      res.json(productsWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const images = await storage.getProductImages(product.id);
      const variants = await storage.getProductVariants(product.id);
      const reviews = await storage.getProductReviews(product.id);

      res.json({ ...product, images, variants, reviews });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const images = await storage.getProductImages(product.id);
      const variants = await storage.getProductVariants(product.id);
      const reviews = await storage.getProductReviews(product.id);

      res.json({ ...product, images, variants, reviews });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      // Log admin action
      await storage.createAuditLog({
        userId: req.session.userId!,
        action: "CREATE_PRODUCT",
        entityType: "PRODUCT",
        entityId: product.id,
        details: JSON.stringify({ name: product.name }),
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await storage.createAuditLog({
        userId: req.session.userId!,
        action: "UPDATE_PRODUCT",
        entityType: "PRODUCT",
        entityId: product.id,
        details: JSON.stringify(validatedData),
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      
      await storage.createAuditLog({
        userId: req.session.userId!,
        action: "DELETE_PRODUCT",
        entityType: "PRODUCT",
        entityId: req.params.id,
      });

      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product Images
  app.post("/api/products/:productId/images", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductImageSchema.parse({
        ...req.body,
        productId: req.params.productId,
      });
      const image = await storage.createProductImage(validatedData);
      res.json(image);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Product Variants
  app.post("/api/products/:productId/variants", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductVariantSchema.parse({
        ...req.body,
        productId: req.params.productId,
      });
      const variant = await storage.createProductVariant(validatedData);
      res.json(variant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== Cart Routes ====================
  
  app.get("/api/cart", async (req, res) => {
    try {
      let cart;
      
      if (req.session.userId) {
        cart = await storage.getCartByUserId(req.session.userId);
        if (!cart) {
          cart = await storage.createCart(req.session.userId, null);
        }
      } else {
        // Guest user - use session ID
        if (!req.session.cartSessionId) {
          req.session.cartSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        }
        cart = await storage.getCartBySessionId(req.session.cartSessionId);
        if (!cart) {
          cart = await storage.createCart(null, req.session.cartSessionId);
        }
      }

      const items = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          const variant = item.variantId ? await storage.getProductVariants(item.productId).then(v => v.find(v => v.id === item.variantId)) : null;
          return { ...item, product, variant };
        })
      );

      res.json({ cart, items: itemsWithDetails });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart/items", async (req, res) => {
    try {
      // Get or create cart
      let cart;
      if (req.session.userId) {
        cart = await storage.getCartByUserId(req.session.userId);
        if (!cart) {
          cart = await storage.createCart(req.session.userId, null);
        }
      } else {
        if (!req.session.cartSessionId) {
          req.session.cartSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        }
        cart = await storage.getCartBySessionId(req.session.cartSessionId);
        if (!cart) {
          cart = await storage.createCart(null, req.session.cartSessionId);
        }
      }

      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        cartId: cart.id,
      });

      const item = await storage.addCartItem(validatedData);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/items/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateCartItem(req.params.id, quantity);
      
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/items/:id", async (req, res) => {
    try {
      await storage.deleteCartItem(req.params.id);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== Orders Routes ====================
  
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      
      let orders;
      if (user?.role === "ADMIN") {
        orders = await storage.getOrders();
      } else {
        orders = await storage.getOrders(req.session.userId);
      }

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check ownership (unless admin)
      const user = await storage.getUser(req.session.userId!);
      if (user?.role !== "ADMIN" && order.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const order = await storage.createOrder(validatedData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      await storage.createAuditLog({
        userId: req.session.userId!,
        action: "UPDATE_ORDER_STATUS",
        entityType: "ORDER",
        entityId: order.id,
        details: JSON.stringify({ status }),
      });

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== Address Routes ====================
  
  app.get("/api/addresses", requireAuth, async (req, res) => {
    try {
      const addresses = await storage.getUserAddresses(req.session.userId!);
      res.json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/addresses", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAddressSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const address = await storage.createAddress(validatedData);
      res.json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== Reviews Routes ====================
  
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products/:productId/reviews", requireAuth, async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        productId: req.params.productId,
        userId: req.session.userId,
      });

      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== Stripe Payment Routes ====================
  
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing not configured. Please add Stripe API keys." 
        });
      }

      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount already in paise
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // ==================== Coupon Routes ====================
  
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, orderAmount } = req.body;
      
      const coupon = await storage.getCouponByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ message: "Coupon is no longer active" });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return res.status(400).json({ 
          message: `Minimum order amount of ₹${coupon.minOrderAmount / 100} required` 
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountPercent) {
        discount = Math.round((orderAmount * coupon.discountPercent) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.discountAmount) {
        discount = coupon.discountAmount;
      }

      res.json({ 
        valid: true,
        discount,
        coupon: {
          code: coupon.code,
          description: coupon.description,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
