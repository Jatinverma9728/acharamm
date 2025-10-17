import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@assets/generated_images/Family_dining_hero_image_b5048a71.png";

export default function Home() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products?isFeatured=true");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data.slice(0, 4); // Get first 4 featured products
    },
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Family enjoying traditional Indian meal with ACHARAM pickles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6" data-testid="text-hero-heading">
              Authentic Indian Pickles,<br />Made with Love
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl" data-testid="text-hero-description">
              Experience the rich flavors of traditional Indian achaar, crafted with time-honored recipes and the finest ingredients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" data-testid="link-shop-now">
                <Button size="lg" className="text-lg px-8 gap-2">
                  Shop Pickles
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" data-testid="link-our-story">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
                >
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Traditional Recipes</h3>
              <p className="text-muted-foreground">
                Handcrafted using authentic family recipes passed down through generations
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest, fresh ingredients sourced from trusted suppliers
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over ₹500, delivered fresh to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-featured-heading">
              Our Bestsellers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved pickles, crafted with passion and perfection
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load products. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products?.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  image={product.images?.[0]?.url || ""}
                  price={product.basePrice}
                  rating={5}
                  reviewCount={product.reviews?.length || 0}
                  isFeatured={product.isFeatured}
                  stock={product.stock}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/products" data-testid="link-view-all-products">
              <Button size="lg" variant="outline" className="gap-2">
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Authentic Flavors?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of happy customers enjoying traditional Indian pickles delivered fresh to their homes
          </p>
          <Link href="/products" data-testid="link-start-shopping">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 gap-2"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
