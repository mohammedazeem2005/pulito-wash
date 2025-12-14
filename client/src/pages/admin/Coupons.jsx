import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Ticket, Percent, IndianRupee } from "lucide-react";

import { format } from "date-fns";

export default function AdminCoupons() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validTo: "",
    isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["/api/admin/coupons"],
  });

  const displayCoupons = coupons.map(c => ({
    ...c,
    validFrom: c.validFrom ? format(new Date(c.validFrom), "yyyy-MM-dd") : "",
    validTo: c.validUntil ? format(new Date(c.validUntil), "yyyy-MM-dd") : "",
  }));

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (selectedCoupon) {
        return apiRequest("PUT", `/api/admin/coupons/${selectedCoupon.id}`, data);
      }
      return apiRequest("POST", "/api/admin/coupons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Success", description: "Coupon saved successfully." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest("DELETE", `/api/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Deleted", description: "Coupon has been deleted." });
      setIsDeleteDialogOpen(false);
      setSelectedCoupon(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        minOrder: coupon.minOrder?.toString() || "",
        maxDiscount: coupon.maxDiscount?.toString() || "",
        usageLimit: coupon.usageLimit?.toString() || "",
        validFrom: coupon.validFrom,
        validTo: coupon.validTo,
        isActive: coupon.isActive,
      });
    } else {
      setSelectedCoupon(null);
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        validFrom: "",
        validTo: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.value || !formData.validFrom || !formData.validTo) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      minOrder: formData.minOrder ? parseFloat(formData.minOrder) : 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 100,
      validFrom: formData.validFrom,
      validUntil: formData.validTo,
      isActive: formData.isActive,
    });
  };

  const handleDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const isExpired = (validTo) => {
    if (!validTo) return false;
    return new Date(validTo) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
            data-testid="button-add-coupon"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-[Poppins] flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              All Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Code
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Discount
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Conditions
                    </th>
                    <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Validity
                    </th>
                    <th className="text-center font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                      Usage
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
                  {displayCoupons.map((coupon, index) => (
                    <tr
                      key={coupon.id}
                      className="border-b last:border-0"
                      data-testid={`coupon-row-${index}`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-[Poppins] font-semibold bg-gradient-to-r from-[#0077FF] to-[#00C2FF] bg-clip-text text-transparent">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {coupon.type === "percentage" ? (
                            <>
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              <span className="font-[Inter] font-medium">{coupon.value}%</span>
                            </>
                          ) : (
                            <>
                              <IndianRupee className="h-4 w-4 text-muted-foreground" />
                              <span className="font-[Inter] font-medium">{coupon.value}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="font-[Inter] text-sm text-muted-foreground py-3 px-4">
                        <div>Min: ₹{coupon.minOrder || 0}</div>
                        {coupon.maxDiscount && <div>Max: ₹{coupon.maxDiscount}</div>}
                      </td>
                      <td className="font-[Inter] text-sm py-3 px-4">
                        <div>{coupon.validFrom}</div>
                        <div className="text-muted-foreground">to {coupon.validTo}</div>
                      </td>
                      <td className="text-center font-[Inter] py-3 px-4">
                        {coupon.usedCount}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </td>
                      <td className="text-center py-3 px-4">
                        {isExpired(coupon.validTo) ? (
                          <Badge variant="secondary">Expired</Badge>
                        ) : coupon.isActive ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDialog(coupon)}
                            data-testid={`button-edit-coupon-${index}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(coupon)}
                            data-testid={`button-delete-coupon-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">
                {selectedCoupon ? "Edit Coupon" : "Add New Coupon"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-[Inter]">Coupon Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g., SAVE20"
                    className="font-[Inter] uppercase"
                    data-testid="input-coupon-code"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter]">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="select-discount-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-[Inter]">
                    Value {formData.type === "percentage" ? "(%)" : "(₹)"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter value"
                    className="font-[Inter]"
                    data-testid="input-coupon-value"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter]">Min Order (₹)</Label>
                  <Input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    placeholder="Optional"
                    className="font-[Inter]"
                    data-testid="input-min-order"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-[Inter]">Max Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="Optional"
                    className="font-[Inter]"
                    data-testid="input-max-discount"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter]">Usage Limit</Label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited"
                    className="font-[Inter]"
                    data-testid="input-usage-limit"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-[Inter]">Valid From</Label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="font-[Inter]"
                    data-testid="input-valid-from"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter]">Valid To</Label>
                  <Input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="font-[Inter]"
                    data-testid="input-valid-to"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-[Inter]">Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-is-active"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                data-testid="button-save-coupon"
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">Delete Coupon</DialogTitle>
            </DialogHeader>
            <p className="font-[Inter] text-muted-foreground py-4">
              Are you sure you want to delete coupon "{selectedCoupon?.code}"? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(selectedCoupon?.id)}
                disabled={deleteMutation.isPending}
                data-testid="button-confirm-delete-coupon"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
