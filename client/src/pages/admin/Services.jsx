import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Shirt, Sparkles, Shield, Star } from "lucide-react";

const categories = [
  { id: "wash-fold", name: "Wash & Fold", icon: Shirt },
  { id: "wash-iron", name: "Wash & Iron", icon: Sparkles },
  { id: "dry-cleaning", name: "Dry Cleaning", icon: Shield },
  { id: "premium", name: "Premium Wash", icon: Star },
];

const mockServices = [
  { id: "1", name: "Regular Clothes (kg)", category: "wash-fold", price: 49, description: "Standard wash and fold per kg" },
  { id: "2", name: "Shirt", category: "wash-iron", price: 79, description: "Wash and iron for shirts" },
  { id: "3", name: "Blazer", category: "dry-cleaning", price: 349, description: "Dry cleaning for blazers" },
  { id: "4", name: "Premium Shirt", category: "premium", price: 149, description: "Premium care for shirts" },
  { id: "5", name: "Trousers", category: "wash-iron", price: 89, description: "Wash and iron for trousers" },
  { id: "6", name: "Suit (2-piece)", category: "dry-cleaning", price: 599, description: "Full dry cleaning for suits" },
];

export default function AdminServices() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const displayServices = services.length > 0 ? services : mockServices;

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (selectedService) {
        return apiRequest("PUT", `/api/services/${selectedService.id}`, data);
      }
      return apiRequest("POST", "/api/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service saved successfully." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save service.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Deleted", description: "Service has been deleted." });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price.toString(),
        description: service.description || "",
      });
    } else {
      setSelectedService(null);
      setFormData({ name: "", category: "", price: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedService(null);
    setFormData({ name: "", category: "", price: "", description: "" });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const groupedServices = displayServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
            data-testid="button-add-service"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {categories.map((category) => {
          const categoryServices = groupedServices[category.id] || [];
          if (categoryServices.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center">
                  <CategoryIcon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="font-[Poppins]">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                          Service Name
                        </th>
                        <th className="text-left font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                          Description
                        </th>
                        <th className="text-right font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                          Price
                        </th>
                        <th className="text-right font-[Inter] font-medium text-sm text-muted-foreground py-3 px-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryServices.map((service, index) => (
                        <tr
                          key={service.id}
                          className="border-b last:border-0"
                          data-testid={`service-row-${category.id}-${index}`}
                        >
                          <td className="font-[Inter] font-medium text-foreground py-3 px-4">
                            {service.name}
                          </td>
                          <td className="font-[Inter] text-muted-foreground py-3 px-4">
                            {service.description || "-"}
                          </td>
                          <td className="font-[Poppins] font-semibold text-[#0077FF] text-right py-3 px-4">
                            ₹{service.price}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenDialog(service)}
                                data-testid={`button-edit-service-${index}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => handleDelete(service)}
                                data-testid={`button-delete-service-${index}`}
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
          );
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">
                {selectedService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-[Inter]">Service Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                  className="font-[Inter]"
                  data-testid="input-service-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-[Inter]">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-[Inter]">Price (₹)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  className="font-[Inter]"
                  data-testid="input-service-price"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-[Inter]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  className="font-[Inter]"
                  data-testid="input-service-description"
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
                data-testid="button-save-service"
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">Delete Service</DialogTitle>
            </DialogHeader>
            <p className="font-[Inter] text-muted-foreground py-4">
              Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(selectedService?.id)}
                disabled={deleteMutation.isPending}
                data-testid="button-confirm-delete"
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
