import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  IndianRupee,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

import { format } from "date-fns";

const statusColors = {
  "Processing": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Picked Up": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Ready": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Delivered": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Out for Delivery": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/admin/customers"],
  });

  const isLoading = statsLoading || ordersLoading;

  const pendingOrders = orders.filter(o => o.status === "Order Placed" || o.status === "Processing").length;
  const completedOrders = orders.filter(o => o.status === "Delivered").length;
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(order => {
      const customer = customers.find(c => c.id === order.userId);
      return {
        id: order.id,
        customer: customer?.name || "Customer",
        amount: order.total,
        status: order.status,
        date: format(new Date(order.createdAt), "MMM d, h:mm a"),
      };
    });

  const kpiCards = [
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: Package, trend: "+12%" },
    { title: "Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, trend: "+8%" },
    { title: "Customers", value: stats?.totalCustomers || 0, icon: Users, trend: "+5%" },
    { title: "Avg Order Value", value: `₹${Math.round(stats?.avgOrderValue || 0)}`, icon: TrendingUp, trend: "+3%" },
  ];

  const statusCards = [
    { title: "Pending", value: pendingOrders, icon: Clock, color: "text-amber-500" },
    { title: "Completed", value: completedOrders, icon: CheckCircle, color: "text-green-500" },
    { title: "Processing", value: orders.filter(o => o.status === "Processing" || o.status === "Washing" || o.status === "Ironing").length, icon: Truck, color: "text-blue-500" },
    { title: "Ready", value: orders.filter(o => o.status === "Ready" || o.status === "Out for Delivery").length, icon: AlertCircle, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => (
            <Card key={index} data-testid={`kpi-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="font-[Poppins] font-bold text-2xl text-foreground">
                        {card.value}
                      </p>
                    )}
                    <p className="font-[Inter] text-xs text-green-500 mt-1">
                      {card.trend} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF]/10 to-[#00C2FF]/10 flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-[#0077FF]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statusCards.map((card, index) => (
            <Card key={index} data-testid={`status-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      {card.title}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <p className="font-[Poppins] font-semibold text-xl text-foreground">
                        {card.value}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <CardTitle className="font-[Poppins]">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Order ID
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Customer
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Amount
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Status
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground font-[Inter]">
                        No orders yet
                      </td>
                    </tr>
                  ) : recentOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0"
                      data-testid={`order-row-${index}`}
                    >
                      <td className="font-[Inter] font-medium text-foreground py-3 px-4">
                        {order.id.slice(0, 12)}
                      </td>
                      <td className="font-[Inter] text-foreground py-3 px-4">
                        {order.customer}
                      </td>
                      <td className="font-[Poppins] font-medium text-foreground py-3 px-4">
                        ₹{order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-[Inter] font-medium ${
                            statusColors[order.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="font-[Inter] text-sm text-muted-foreground py-3 px-4">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
