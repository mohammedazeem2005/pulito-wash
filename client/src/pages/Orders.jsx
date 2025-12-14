import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

const statusColors = {
  "Order Placed": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Picked Up": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Processing": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Washing": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Ironing": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Ready": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Out for Delivery": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Delivered": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
};

export default function Orders() {
  const { user, isAuthenticated } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders", "user", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="font-[Poppins] font-semibold text-2xl text-foreground mb-2">
            Please Login
          </h2>
          <p className="font-[Inter] text-muted-foreground mb-6">
            Login to view your orders
          </p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white">
              Login
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[Poppins] font-bold text-3xl text-white">
            My Orders
          </h1>
          <p className="font-[Inter] text-white/80 mt-1">
            Track and manage your laundry orders
          </p>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-[Poppins] font-semibold text-2xl text-foreground mb-2">
                No Orders Yet
              </h2>
              <p className="font-[Inter] text-muted-foreground mb-6">
                You haven't placed any orders yet. Start by booking a laundry service!
              </p>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white">
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover-elevate" data-testid={`order-card-${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-[Poppins] font-semibold text-foreground">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 font-[Inter]">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 font-[Inter]">
                              <Clock className="h-4 w-4" />
                              {order.pickupTime}
                            </span>
                          </div>
                          <p className="font-[Poppins] font-semibold text-[#0077FF] mt-2">
                            ₹{order.total}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={statusColors[order.status] || "bg-gray-100"}>
                          {order.status}
                        </Badge>
                        <Link href={`/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-[Inter]"
                            data-testid={`button-track-${order.id}`}
                          >
                            Track Order
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
