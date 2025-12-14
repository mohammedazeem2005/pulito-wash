import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Filter, Eye, RefreshCw } from "lucide-react";

const ORDER_STATUSES = [
  "Order Placed",
  "Picked Up",
  "Processing",
  "Washing",
  "Ironing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];


const statusColors = {
  "Order Placed": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  "Picked Up": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Processing": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Washing": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "Ironing": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Ready": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Out for Delivery": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Delivered": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
};

export default function AdminOrders() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/admin/customers"],
  });

  const displayOrders = orders.map(order => {
    const customer = customers.find(c => c.id === order.userId);
    return {
      ...order,
      customerName: customer?.name || "Customer",
      customerPhone: customer?.phone || "",
      amount: order.total,
    };
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      return apiRequest("PUT", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Status updated", description: "Order status has been updated." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-4">
            <CardTitle className="font-[Poppins]">All Orders</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 font-[Inter]"
                  data-testid="input-search-orders"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                      Items
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Amount
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Status
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0"
                      data-testid={`admin-order-row-${index}`}
                    >
                      <td className="font-[Inter] font-medium text-foreground py-3 px-4">
                        {order.id.slice(0, 12)}
                      </td>
                      <td className="font-[Inter] text-foreground py-3 px-4">
                        {order.customerName || "N/A"}
                      </td>
                      <td className="font-[Inter] text-muted-foreground py-3 px-4">
                        {order.items?.length || 0} items
                      </td>
                      <td className="font-[Poppins] font-medium text-foreground py-3 px-4">
                        ₹{order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger
                            className={`w-40 h-8 text-xs font-medium ${statusColors[order.status]}`}
                            data-testid={`select-order-status-${index}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(order)}
                          data-testid={`button-view-order-${index}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">
                Order Details - {selectedOrder?.id?.slice(0, 12)}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground">Customer</p>
                    <p className="font-[Inter] font-medium">{selectedOrder.customerName}</p>
                    <p className="font-[Inter] text-sm">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground">Payment</p>
                    <p className="font-[Inter] font-medium capitalize">{selectedOrder.paymentMethod}</p>
                    <Badge
                      variant={selectedOrder.paymentStatus === "paid" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="font-[Inter] text-sm text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <span className="font-[Inter]">
                          {item.garment} ({item.serviceType}) x{item.quantity}
                        </span>
                        <span className="font-[Poppins] font-medium">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground">Pickup Date</p>
                    <p className="font-[Inter] font-medium">{selectedOrder.pickupDate}</p>
                    <p className="font-[Inter] text-sm">{selectedOrder.timeSlot}</p>
                  </div>
                  <div>
                    <p className="font-[Inter] text-sm text-muted-foreground">Delivery Date</p>
                    <p className="font-[Inter] font-medium">{selectedOrder.deliveryDate}</p>
                  </div>
                </div>
                <div>
                  <p className="font-[Inter] text-sm text-muted-foreground">Address</p>
                  <p className="font-[Inter]">
                    {selectedOrder.address?.street}, {selectedOrder.address?.city},{" "}
                    {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-[Poppins] font-semibold text-lg">Total Amount</span>
                  <span className="font-[Poppins] font-bold text-xl text-[#0077FF]">
                    ₹{selectedOrder.amount}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
