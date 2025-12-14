import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Package, IndianRupee } from "lucide-react";

import { format } from "date-fns";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
  });

  const displayCustomers = customers.map(c => ({
    ...c,
    status: c.totalOrders > 0 ? "active" : "inactive",
  }));

  const filteredCustomers = displayCustomers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
  });

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-4">
            <CardTitle className="font-[Poppins]">All Customers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 font-[Inter]"
                data-testid="input-search-customers"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Customer
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Contact
                    </th>
                    <th className="text-center font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Orders
                    </th>
                    <th className="text-right font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Total Spent
                    </th>
                    <th className="text-center font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Status
                    </th>
                    <th className="text-right font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="border-b last:border-0"
                      data-testid={`customer-row-${index}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-[#0077FF] to-[#00C2FF] text-white font-[Poppins] font-medium">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-[Inter] font-medium text-foreground">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-[Inter] text-foreground">{customer.email}</p>
                        <p className="font-[Inter] text-sm text-muted-foreground">
                          {customer.phone}
                        </p>
                      </td>
                      <td className="text-center font-[Poppins] font-medium text-foreground py-3 px-4">
                        {customer.totalOrders}
                      </td>
                      <td className="text-right font-[Poppins] font-semibold text-[#0077FF] py-3 px-4">
                        ₹{customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          variant={customer.status === "active" ? "default" : "secondary"}
                          className={
                            customer.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(customer)}
                            data-testid={`button-view-customer-${index}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-[#0077FF] to-[#00C2FF] text-white font-[Poppins] font-bold text-xl">
                      {getInitials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-[Poppins] font-semibold text-lg">
                      {selectedCustomer.name}
                    </h3>
                    <p className="font-[Inter] text-muted-foreground">
                      {selectedCustomer.email}
                    </p>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Package className="h-8 w-8 text-[#0077FF]" />
                      <div>
                        <p className="font-[Inter] text-sm text-muted-foreground">
                          Total Orders
                        </p>
                        <p className="font-[Poppins] font-bold text-xl">
                          {selectedCustomer.totalOrders}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <IndianRupee className="h-8 w-8 text-[#0077FF]" />
                      <div>
                        <p className="font-[Inter] text-sm text-muted-foreground">
                          Total Spent
                        </p>
                        <p className="font-[Poppins] font-bold text-xl">
                          ₹{selectedCustomer.totalSpent.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <p className="font-[Inter] font-medium text-sm text-muted-foreground mb-2">
                    Contact Information
                  </p>
                  <div className="p-3 bg-muted rounded-lg space-y-1">
                    <p className="font-[Inter]">{selectedCustomer.email}</p>
                    <p className="font-[Inter] text-muted-foreground">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-[Inter] text-muted-foreground">Member Since</span>
                  <span className="font-[Inter] font-medium">
                    {selectedCustomer.joinedAt ? format(new Date(selectedCustomer.joinedAt), "MMM d, yyyy") : "N/A"}
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
