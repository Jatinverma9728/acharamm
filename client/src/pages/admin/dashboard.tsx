import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,24,500",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Total Orders",
      value: "245",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-primary",
    },
    {
      title: "Total Products",
      value: "48",
      change: "+4",
      icon: Package,
      color: "text-secondary",
    },
    {
      title: "Total Customers",
      value: "1,234",
      change: "+15.3%",
      icon: Users,
      color: "text-chart-4",
    },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Priya Sharma", amount: 59800, status: "DELIVERED" },
    { id: "ORD-002", customer: "Rajesh Kumar", amount: 29900, status: "SHIPPED" },
    { id: "ORD-003", customer: "Anjali Desai", amount: 74700, status: "PROCESSING" },
    { id: "ORD-004", customer: "Vikram Singh", amount: 44800, status: "PENDING" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2" data-testid="text-page-heading">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} data-testid={`card-stat-${idx}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif" data-testid={`text-stat-value-${idx}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-accent font-medium">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                data-testid={`order-item-${order.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium" data-testid={`text-order-id-${order.id}`}>
                    {order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary font-serif">
                    ₹{(order.amount / 100).toFixed(2)}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                    order.status === "DELIVERED"
                      ? "bg-accent/10 text-accent"
                      : order.status === "SHIPPED"
                      ? "bg-primary/10 text-primary"
                      : order.status === "PROCESSING"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
