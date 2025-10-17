import { Link } from "wouter";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number; // in paise
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  image,
  price,
  rating = 0,
  reviewCount = 0,
  isFeatured = false,
  stock = 0,
}: ProductCardProps) {
  const formattedPrice = `₹${(price / 100).toFixed(2)}`;
  const isOutOfStock = stock === 0;

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-product-${id}`}>
      <Link href={`/product/${slug}`} data-testid={`link-product-${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
          {isFeatured && (
            <Badge className="absolute top-2 right-2" data-testid={`badge-featured-${id}`}>
              Featured
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors" data-testid={`text-product-name-${id}`}>
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "fill-secondary text-secondary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground" data-testid={`text-review-count-${id}`}>
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <p className="text-2xl font-bold text-primary font-serif" data-testid={`text-price-${id}`}>
          {formattedPrice}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2"
          disabled={isOutOfStock}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
