import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminLayout } from "@/pages/admin/layout";

// Pages
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import NotFound from "@/pages/not-found";

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Customer Routes */}
      <Route path="/">
        <CustomerLayout>
          <Home />
        </CustomerLayout>
      </Route>
      <Route path="/products">
        <CustomerLayout>
          <Products />
        </CustomerLayout>
      </Route>
      <Route path="/product/:slug">
        <CustomerLayout>
          <ProductDetail />
        </CustomerLayout>
      </Route>
      <Route path="/cart">
        <CustomerLayout>
          <Cart />
        </CustomerLayout>
      </Route>
      <Route path="/checkout">
        <CustomerLayout>
          <Checkout />
        </CustomerLayout>
      </Route>

      {/* Auth Routes (No Navbar/Footer) */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />

      {/* Admin Routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/products">
        <AdminLayout>
          <AdminProducts />
        </AdminLayout>
      </Route>

      {/* 404 */}
      <Route>
        <CustomerLayout>
          <NotFound />
        </CustomerLayout>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
