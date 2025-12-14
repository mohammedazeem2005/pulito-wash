import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Package,
  Users,
  Calendar,
  Download,
} from "lucide-react";

const mockRevenueData = {
  daily: [
    { date: "Dec 03", revenue: 12500, orders: 28 },
    { date: "Dec 04", revenue: 15800, orders: 35 },
    { date: "Dec 05", revenue: 11200, orders: 24 },
    { date: "Dec 06", revenue: 18900, orders: 42 },
    { date: "Dec 07", revenue: 16400, orders: 38 },
    { date: "Dec 08", revenue: 21000, orders: 48 },
    { date: "Dec 09", revenue: 19500, orders: 45 },
  ],
  weekly: [
    { date: "Week 45", revenue: 85000, orders: 195 },
    { date: "Week 46", revenue: 92000, orders: 210 },
    { date: "Week 47", revenue: 78000, orders: 180 },
    { date: "Week 48", revenue: 105000, orders: 240 },
    { date: "Week 49", revenue: 115300, orders: 260 },
  ],
  monthly: [
    { date: "Aug", revenue: 320000, orders: 720 },
    { date: "Sep", revenue: 345000, orders: 790 },
    { date: "Oct", revenue: 380000, orders: 870 },
    { date: "Nov", revenue: 410000, orders: 940 },
    { date: "Dec", revenue: 456780, orders: 1050 },
  ],
};

const mockServiceBreakdown = [
  { service: "Wash & Fold", revenue: 185000, orders: 520, percentage: 40 },
  { service: "Wash & Iron", revenue: 138000, orders: 380, percentage: 30 },
  { service: "Dry Cleaning", revenue: 92000, orders: 120, percentage: 20 },
  { service: "Premium Wash", revenue: 41780, orders: 80, percentage: 10 },
];

const mockTopCustomers = [
  { name: "Anita Patel", orders: 22, spent: 9800 },
  { name: "Priya Sharma", orders: 15, spent: 6750 },
  { name: "Deepa Gupta", orders: 12, spent: 5600 },
  { name: "Rahul Mehta", orders: 8, spent: 4200 },
  { name: "Vikram Singh", orders: 5, spent: 2100 },
];

export default function AdminReports() {
  const [period, setPeriod] = useState("daily");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/api/admin/reports", period],
  });

  const revenueData = mockRevenueData[period] || mockRevenueData.daily;
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36" data-testid="select-period">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-[Inter] text-sm text-muted-foreground">Total Revenue</p>
                  <p className="font-[Poppins] font-bold text-2xl text-foreground">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-[Inter] text-xs text-green-500">+12% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF]/10 to-[#00C2FF]/10 flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-[#0077FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-[Inter] text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-[Poppins] font-bold text-2xl text-foreground">{totalOrders}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-[Inter] text-xs text-green-500">+8% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF]/10 to-[#00C2FF]/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-[#0077FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-[Inter] text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="font-[Poppins] font-bold text-2xl text-foreground">₹{avgOrderValue}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-amber-500" />
                    <span className="font-[Inter] text-xs text-amber-500">-2% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077FF]/10 to-[#00C2FF]/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-[#0077FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-[Poppins]">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[#0077FF] to-[#00C2FF] rounded-t-md transition-all hover:opacity-80"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                      minHeight: "20px",
                    }}
                    data-testid={`bar-${index}`}
                  />
                  <span className="font-[Inter] text-xs text-muted-foreground text-center">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-[Poppins]">Revenue by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockServiceBreakdown.map((service, index) => (
                  <div key={index} data-testid={`service-breakdown-${index}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-[Inter] font-medium">{service.service}</span>
                      <span className="font-[Poppins] font-semibold text-[#0077FF]">
                        ₹{service.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0077FF] to-[#00C2FF] rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                    <p className="font-[Inter] text-xs text-muted-foreground mt-1">
                      {service.orders} orders ({service.percentage}%)
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-[Poppins] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    data-testid={`top-customer-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center text-white font-[Poppins] font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-[Inter] font-medium">{customer.name}</p>
                        <p className="font-[Inter] text-xs text-muted-foreground">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <span className="font-[Poppins] font-semibold text-[#0077FF]">
                      ₹{customer.spent.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
