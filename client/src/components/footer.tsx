import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl font-bold text-primary mb-4">ACHARAM</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Authentic Indian pickles made with traditional recipes and premium ingredients. 
              Taste the tradition in every jar.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" data-testid="link-footer-products">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Shop Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Our Story
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recipes" data-testid="link-footer-recipes">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Recipes
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" data-testid="link-footer-shipping">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Shipping Info
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/returns" data-testid="link-footer-returns">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Returns & Refunds
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/faq" data-testid="link-footer-faq">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/account/orders" data-testid="link-footer-track-order">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Track Order
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers and updates
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button type="submit" data-testid="button-subscribe">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ACHARAM. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" data-testid="link-footer-privacy">
              <span className="hover:text-foreground transition-colors">Privacy Policy</span>
            </Link>
            <Link href="/terms" data-testid="link-footer-terms">
              <span className="hover:text-foreground transition-colors">Terms of Service</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
