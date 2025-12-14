import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Save,
  Loader2,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data) => apiRequest("PUT", `/api/users/${user?.id}`, data),
    onSuccess: (response) => {
      updateUser(response);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateMutation.mutate({
      ...formData,
      addresses,
    });
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      });
      return;
    }
    const addressWithId = {
      ...newAddress,
      id: crypto.randomUUID(),
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, addressWithId]);
    setNewAddress({ label: "", street: "", city: "", state: "", pincode: "" });
    setShowAddAddress(false);
  };

  const handleRemoveAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="font-[Poppins] font-semibold text-2xl text-foreground mb-2">
            Please Login
          </h2>
          <p className="font-[Inter] text-muted-foreground mb-6">
            Login to view your profile
          </p>
          <Button
            onClick={() => setLocation("/login")}
            className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
          >
            Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[Poppins] font-bold text-3xl text-white">
            My Profile
          </h1>
          <p className="font-[Inter] text-white/80 mt-1">
            Manage your account settings and addresses
          </p>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-[Poppins] flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-[Inter] font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="font-[Inter]"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter] font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="font-[Inter]"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter] font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="font-[Inter]"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-[Poppins] flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Addresses
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddAddress(!showAddAddress)}
                data-testid="button-add-address"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddAddress && (
                <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">Label</Label>
                      <Input
                        placeholder="Home, Office, etc."
                        value={newAddress.label}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, label: e.target.value })
                        }
                        className="font-[Inter]"
                        data-testid="input-address-label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">Street Address</Label>
                      <Input
                        placeholder="Enter street address"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className="font-[Inter]"
                        data-testid="input-address-street"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">City</Label>
                      <Input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="font-[Inter]"
                        data-testid="input-address-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">State</Label>
                      <Input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className="font-[Inter]"
                        data-testid="input-address-state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">Pincode</Label>
                      <Input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                        className="font-[Inter]"
                        data-testid="input-address-pincode"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddAddress}
                      className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                      data-testid="button-save-address"
                    >
                      Save Address
                    </Button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <p className="text-center text-muted-foreground font-[Inter] py-8">
                  No addresses saved yet
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg ${
                        address.isDefault ? "border-[#0077FF] bg-[#0077FF]/5" : ""
                      }`}
                      data-testid={`address-${address.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-[Poppins] font-semibold">
                              {address.label}
                            </p>
                            {address.isDefault && (
                              <span className="text-xs bg-[#0077FF] text-white px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-[Inter] text-sm text-muted-foreground mt-1">
                            {address.street}, {address.city}, {address.state} -{" "}
                            {address.pincode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!address.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(address.id)}
                              className="text-sm"
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAddress(address.id)}
                            className="text-destructive"
                            data-testid={`button-remove-address-${address.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive border-destructive"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
              disabled={updateMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
