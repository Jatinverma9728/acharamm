import { useState } from "react";
import { useRoute } from "wouter";
import { Minus, Plus, ShoppingCart, Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import mangoImage from "@assets/generated_images/Mango_pickle_product_photo_23eaba3f.png";
import mixedImage from "@assets/generated_images/Mixed_vegetable_pickle_photo_97eff0bc.png";
import lemonImage from "@assets/generated_images/Lemon_pickle_product_photo_65120c52.png";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("500g");
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - will be replaced with real data
  const product = {
    id: "1",
    name: "Traditional Mango Pickle",
    slug: params?.slug || "",
    description:
      "Our signature mango pickle is made using the finest raw mangoes, blended with aromatic spices and aged to perfection. This traditional recipe has been passed down through generations, ensuring an authentic taste that brings back memories of home-cooked meals.",
    images: [mangoImage, mangoImage, mangoImage],
    price: 29900,
    rating: 5,
    reviewCount: 124,
    stock: 50,
    isFeatured: true,
    category: "Mango Pickle",
    variants: [
      { id: "1", name: "250g", price: 19900, stock: 30 },
      { id: "2", name: "500g", price: 29900, stock: 50 },
      { id: "3", name: "1kg", price: 49900, stock: 20 },
    ],
    ingredients:
      "Raw Mango, Mustard Oil, Red Chili Powder, Turmeric, Fenugreek Seeds, Mustard Seeds, Fennel Seeds, Salt, Asafoetida",
    nutritionPer100g: {
      calories: "180 kcal",
      fat: "15g",
      carbs: "8g",
      protein: "2g",
      sodium: "1200mg",
    },
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Mixed Vegetable Pickle",
      slug: "mixed-vegetable-pickle",
      image: mixedImage,
      price: 24900,
      rating: 4,
      reviewCount: 89,
      stock: 30,
    },
    {
      id: "3",
      name: "Tangy Lemon Pickle",
      slug: "tangy-lemon-pickle",
      image: lemonImage,
      price: 19900,
      rating: 5,
      reviewCount: 156,
      stock: 45,
    },
  ];

  const reviews = [
    {
      id: "1",
      author: "Priya Sharma",
      rating: 5,
      date: "2024-10-10",
      comment:
        "Absolutely amazing! Tastes just like my grandmother's recipe. The perfect balance of spices and tanginess.",
    },
    {
      id: "2",
      author: "Rajesh Kumar",
      rating: 5,
      date: "2024-10-05",
      comment:
        "Best mango pickle I've ever bought online. Fresh, authentic, and delivered perfectly packaged.",
    },
    {
      id: "3",
      author: "Anjali Desai",
      rating: 4,
      date: "2024-09-28",
      comment:
        "Really good quality. Slightly less spicy than I expected, but still delicious with every meal!",
    },
  ];

  const currentVariant = product.variants.find((v) => v.name === selectedVariant);
  const currentPrice = currentVariant?.price || product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <a href="/" className="hover:text-foreground transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/products" className="hover:text-foreground transition-colors">
          Products
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-card">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product-main"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
                data-testid={`button-thumbnail-${idx}`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="sticky top-20 self-start">
          {product.isFeatured && (
            <Badge className="mb-3" data-testid="badge-featured">
              Featured
            </Badge>
          )}

          <h1 className="font-serif text-4xl font-bold mb-4" data-testid="text-product-name">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-secondary text-secondary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground" data-testid="text-review-count">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-primary font-serif mb-6" data-testid="text-price">
            ₹{(currentPrice / 100).toFixed(2)}
          </p>

          <p className="text-muted-foreground mb-6" data-testid="text-description">
            {product.description}
          </p>

          <Separator className="my-6" />

          {/* Variant Selection */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block">Size</Label>
            <Select value={selectedVariant} onValueChange={setSelectedVariant}>
              <SelectTrigger data-testid="select-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.name}>
                    {variant.name} - ₹{(variant.price / 100).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                data-testid="button-decrease-quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="button-increase-quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button className="flex-1 gap-2" size="lg" data-testid="button-add-to-cart">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11" data-testid="button-wishlist">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11" data-testid="button-share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Stock Info */}
          <div className="text-sm text-muted-foreground">
            <p data-testid="text-stock-info">
              ✓ {currentVariant?.stock || product.stock} items in stock
            </p>
            <p>✓ Free shipping on orders over ₹500</p>
            <p>✓ Easy returns within 7 days</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description" data-testid="tab-description">
            Description
          </TabsTrigger>
          <TabsTrigger value="ingredients" data-testid="tab-ingredients">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="nutrition" data-testid="tab-nutrition">
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="reviews" data-testid="tab-reviews">
            Reviews ({product.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            <h3 className="font-semibold text-lg mt-6 mb-3">Perfect Pairing</h3>
            <p className="text-muted-foreground">
              Enjoy with rice, roti, paratha, or as a side with any Indian meal. Also great with sandwiches and wraps!
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-6">
          <p className="text-muted-foreground">{product.ingredients}</p>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            {Object.entries(product.nutritionPer100g).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground capitalize">{key}</p>
                <p className="font-semibold text-lg">{value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-secondary text-secondary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="font-serif text-3xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
