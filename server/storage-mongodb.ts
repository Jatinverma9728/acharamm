// MongoDB storage implementation
import { Types, Document } from 'mongoose';
import { IUser, User } from './models/user.model';
import { ICategory, Category } from './models/category.model';
import { IProduct, Product } from './models/product.model';

export interface IStorage {
  // Users
  getUser(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser>;
  updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null>;

  // Categories
  getCategories(): Promise<ICategory[]>;
  getCategory(id: string): Promise<ICategory | null>;
  createCategory(categoryData: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ICategory>;

  // Products
  getProducts(filters?: { 
    categoryId?: string; 
    isActive?: boolean; 
    isFeatured?: boolean 
  }): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct | null>;
  getProductBySlug(slug: string): Promise<IProduct | null>;
  createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct>;
  updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  // Helper methods to convert between Mongoose documents and plain objects
  private toIUser(doc: any): IUser {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toICategory(doc: any): ICategory {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toIProduct(doc: any): IProduct {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      category: doc.category?._id?.toString() || doc.category,
      basePrice: doc.basePrice,
      stock: doc.stock,
      isActive: doc.isActive,
      isFeatured: doc.isFeatured,
      images: doc.images,
      weight: doc.weight,
      ingredients: doc.ingredients,
      shelfLife: doc.shelfLife,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
  // User Methods
  async getUser(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const user = await User.findById(id).lean().exec();
    return user ? this.toIUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).lean().exec();
    return user ? this.toIUser(user) : null;
  }

  async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const user = new User(userData);
    const savedUser = await user.save();
    return this.toIUser(savedUser.toObject());
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $set: updates },
      { new: true, runValidators: true }
    ).lean().exec();
    
    return updatedUser ? this.toIUser(updatedUser) : null;
  }

  // Category Methods
  async getCategories(): Promise<ICategory[]> {
    const categories = await Category.find({}).sort({ name: 1 }).lean().exec();
    return categories.map(cat => this.toICategory(cat));
  }

  async getCategory(id: string): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const category = await Category.findById(id).lean().exec();
    return category ? this.toICategory(category) : null;
  }

  async createCategory(categoryData: Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ICategory> {
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    return this.toICategory(savedCategory.toObject());
  }

  // Product Methods
  async getProducts(filters: { 
    categoryId?: string; 
    isActive?: boolean; 
    isFeatured?: boolean 
  } = {}): Promise<IProduct[]> {
    const query: any = {};
    
    if (filters.categoryId && Types.ObjectId.isValid(filters.categoryId)) {
      query.category = new Types.ObjectId(filters.categoryId);
    }
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    return products.map(p => this.toIProduct(p));
  }

  async getProduct(id: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .lean()
      .exec();
    return product ? this.toIProduct(product) : null;
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug')
      .lean()
      .exec();
    return product ? this.toIProduct(product) : null;
  }

  async createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    const product = new Product({
      ...productData,
      category: new Types.ObjectId(productData.category as unknown as string)
    });
    const savedProduct = await product.save();
    return this.toIProduct(savedProduct.toObject());
  }

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    
    // Convert category string ID to ObjectId if present
    const updateData = { ...updates };
    if (updateData.category) {
      updateData.category = new Types.ObjectId(updateData.category as unknown as string);
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate('category', 'name slug')
    .lean()
    .exec();
    
    return updatedProduct ? this.toIProduct(updatedProduct) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Product.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  // Product Images
  async getProductImages(productId: string): Promise<string[]> {
    if (!Types.ObjectId.isValid(productId)) return [];
    const product = await Product.findById(productId, 'images').lean().exec();
    return product?.images || [];
  }

  // Product Variants
  async getProductVariants(productId: string): Promise<any[]> {
    // Return empty array as we don't have variants in the model yet
    return [];
  }

  // Product Reviews
  async getProductReviews(productId: string): Promise<any[]> {
    // Return empty array as we don't have reviews in the model yet
    return [];
  }
}

// Export a singleton instance
export const storage = new MongoDBStorage();
