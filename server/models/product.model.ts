import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  basePrice: number; // Price in paise (smallest currency unit)
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images?: string[];
  weight?: number; // in grams
  ingredients?: string[];
  shelfLife?: number; // in days
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {
  // Add any document methods here
}

export interface IProductModel extends Model<IProductDocument> {
  // Add any static methods here
}

const productSchema = new Schema<IProductDocument, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: [{
      type: String,
      trim: true,
    }],
    weight: {
      type: Number,
      min: 0,
    },
    ingredients: [{
      type: String,
      trim: true,
    }],
    shelfLife: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

// Create and export the model
export const Product = mongoose.model<IProductDocument, IProductModel>('Product', productSchema);

export type ProductDocument = ReturnType<typeof Product.castObject>;
