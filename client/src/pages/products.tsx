import { useState } from "react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Products() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["/api/products", { categoryId: selectedCategory, isActive: true }],
    queryFn: async () => {
      const params = new URLSearchParams({ isActive: "true" });
      if (selectedCategory) params.append("categoryId", selectedCategory);
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Categories
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="cat-all"
              checked={selectedCategory === null}
              onCheckedChange={() => setSelectedCategory(null)}
              data-testid="checkbox-category-all"
            />
            <Label htmlFor="cat-all" className="flex-1 cursor-pointer text-sm">
              All Products
            </Label>
            <span className="text-xs text-muted-foreground">
              ({products?.length || 0})
            </span>
          </div>
          {categories?.map((category: any) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategory === category.id}
                onCheckedChange={() => setSelectedCategory(category.id)}
                data-testid={`checkbox-category-${category.id}`}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Availability</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="in-stock" defaultChecked data-testid="checkbox-in-stock" />
            <Label htmlFor="in-stock" className="cursor-pointer text-sm">
              In Stock
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="featured" data-testid="checkbox-featured" />
            <Label htmlFor="featured" className="cursor-pointer text-sm">
              Featured Products
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-heading">
          Our Products
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore our collection of authentic Indian pickles
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <FilterSidebar />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
            <p className="text-sm text-muted-foreground" data-testid="text-product-count">
              {isLoading ? "Loading..." : `Showing ${products?.length || 0} products`}
            </p>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <Select defaultValue="featured">
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                  data-testid="button-view-grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
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
        </div>
      </div>
    </div>
  );
}
