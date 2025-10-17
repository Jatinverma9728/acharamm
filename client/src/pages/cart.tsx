import { useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import mangoImage from "@assets/generated_images/Mango_pickle_product_photo_23eaba3f.png";
import mixedImage from "@assets/generated_images/Mixed_vegetable_pickle_photo_97eff0bc.png";

export default function Cart() {
  // Mock cart items - will be replaced with real data
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      productId: "1",
      productName: "Traditional Mango Pickle",
      productSlug: "traditional-mango-pickle",
      variant: "500g",
      price: 29900,
      quantity: 2,
      image: mangoImage,
      stock: 50,
    },
    {
      id: "2",
      productId: "2",
      productName: "Mixed Vegetable Pickle",
      productSlug: "mixed-vegetable-pickle",
      variant: "250g",
      price: 24900,
      quantity: 1,
      image: mixedImage,
      stock: 30,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0; // Will be calculated based on coupon
  const shipping = subtotal >= 50000 ? 0 : 5000; // Free shipping over ₹500
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3" data-testid="text-empty-cart">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products" data-testid="link-continue-shopping">
            <Button size="lg" className="gap-2">
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl font-bold mb-8" data-testid="text-page-heading">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/product/${item.productSlug}`}>
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-card hover-elevate">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productSlug}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors" data-testid={`text-product-name-${item.id}`}>
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      Size: {item.variant}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-primary font-serif" data-testid={`text-price-${item.id}`}>
                        ₹{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto gap-2 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <h2 className="font-serif text-2xl font-bold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    data-testid="input-coupon"
                  />
                  <Button variant="outline" data-testid="button-apply-coupon">
                    Apply
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium" data-testid="text-subtotal">
                    ₹{(subtotal / 100).toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-accent" data-testid="text-discount">
                      -₹{(discount / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium" data-testid="text-shipping">
                    {shipping === 0 ? "FREE" : `₹${(shipping / 100).toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{((50000 - subtotal) / 100).toFixed(2)} more for free shipping
                  </p>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary font-serif" data-testid="text-total">
                    ₹{(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full gap-2" data-testid="button-checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="outline" size="lg" className="w-full" data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
