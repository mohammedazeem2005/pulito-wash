import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { apiRequest } from "@/lib/queryClient";
import {
  Shirt,
  Sparkles,
  Shield,
  Star,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";

const serviceTypes = [
  { id: "wash-fold", title: "Wash & Fold", icon: Shirt },
  { id: "wash-iron", title: "Wash & Iron", icon: Sparkles },
  { id: "dry-cleaning", title: "Dry Cleaning", icon: Shield },
  { id: "premium", title: "Premium Wash", icon: Star },
];

const garmentsByService = {
  "wash-fold": [
    { name: "Regular Clothes (kg)", price: 49 },
    { name: "Bedsheet (Single)", price: 59 },
    { name: "Bedsheet (Double)", price: 79 },
    { name: "Blanket (Single)", price: 149 },
    { name: "Blanket (Double)", price: 199 },
    { name: "Towel", price: 39 },
    { name: "Curtains (kg)", price: 89 },
  ],
  "wash-iron": [
    { name: "Shirt", price: 79 },
    { name: "T-Shirt", price: 69 },
    { name: "Trousers", price: 89 },
    { name: "Jeans", price: 99 },
    { name: "Kurta", price: 99 },
    { name: "Dress", price: 149 },
    { name: "Saree", price: 199 },
  ],
  "dry-cleaning": [
    { name: "Blazer", price: 349 },
    { name: "Suit (2-piece)", price: 599 },
    { name: "Suit (3-piece)", price: 799 },
    { name: "Overcoat", price: 499 },
    { name: "Wedding Lehenga", price: 999 },
    { name: "Sherwani", price: 799 },
  ],
  premium: [
    { name: "Premium Shirt", price: 149 },
    { name: "Premium Trousers", price: 169 },
    { name: "Silk Items", price: 249 },
    { name: "Cashmere Items", price: 349 },
    { name: "Designer Wear", price: 399 },
  ],
};

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

export default function Booking() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { items, addItem, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("wash-fold");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddItem = (garment) => {
    const serviceTitle = serviceTypes.find((s) => s.id === selectedService)?.title || "";
    addItem({
      garment: garment.name,
      quantity: 1,
      price: garment.price,
      serviceType: serviceTitle,
    });
  };

  const finalAmount = totalAmount - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await apiRequest("POST", "/api/coupons/validate", {
        code: couponCode,
        orderTotal: totalAmount,
      });
      setDiscount(response.discount || 0);
      toast({
        title: "Coupon applied!",
        description: `You saved ₹${response.discount}`,
      });
    } catch (error) {
      toast({
        title: "Invalid coupon",
        description: error.message || "This coupon code is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to place an order.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items,
        subtotal: totalAmount,
        discount,
        total: finalAmount,
        pickupDate,
        pickupTime: timeSlot,
        deliveryDate,
        deliveryTime: timeSlot,
        address: {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          label: "Delivery Address",
          ...address,
          isDefault: false,
        },
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
        couponCode: couponCode || undefined,
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your order #${response.id.slice(0, 8)} has been confirmed.`,
      });
      setLocation(`/orders/${response.id}`);
    } catch (error) {
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minDeliveryDate = pickupDate
    ? new Date(new Date(pickupDate).getTime() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : today;

  return (
    <Layout>
      <section className="py-8 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-[Poppins] font-bold text-3xl text-white mb-2">
            Book Your Laundry
          </h1>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-[Poppins] font-semibold text-sm ${
                    step >= s
                      ? "bg-white text-[#0077FF]"
                      : "bg-white/30 text-white"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step > s ? "bg-white" : "bg-white/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-[Poppins]">Select Service & Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedService} onValueChange={setSelectedService}>
                      <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent mb-6">
                        {serviceTypes.map((service) => (
                          <TabsTrigger
                            key={service.id}
                            value={service.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-[Poppins] text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0077FF] data-[state=active]:to-[#00C2FF] data-[state=active]:text-white"
                            data-testid={`service-tab-${service.id}`}
                          >
                            <service.icon className="h-4 w-4" />
                            {service.title}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.keys(garmentsByService).map((serviceId) => (
                        <TabsContent key={serviceId} value={serviceId}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {garmentsByService[serviceId].map((garment, index) => {
                              const cartItem = items.find(
                                (i) =>
                                  i.garment === garment.name &&
                                  i.serviceType ===
                                    serviceTypes.find((s) => s.id === serviceId)?.title
                              );
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 border rounded-lg"
                                  data-testid={`garment-item-${index}`}
                                >
                                  <div>
                                    <p className="font-[Inter] font-medium text-foreground">
                                      {garment.name}
                                    </p>
                                    <p className="font-[Poppins] text-sm text-[#0077FF]">
                                      ₹{garment.price}
                                    </p>
                                  </div>
                                  {cartItem ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                          updateQuantity(
                                            garment.name,
                                            cartItem.serviceType,
                                            cartItem.quantity - 1
                                          )
                                        }
                                        data-testid={`button-decrease-${index}`}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center font-[Inter]">
                                        {cartItem.quantity}
                                      </span>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                          updateQuantity(
                                            garment.name,
                                            cartItem.serviceType,
                                            cartItem.quantity + 1
                                          )
                                        }
                                        data-testid={`button-increase-${index}`}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddItem(garment)}
                                      className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                                      data-testid={`button-add-${index}`}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-[Poppins] flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Schedule Pickup & Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-[Inter] font-medium">Pickup Date</Label>
                        <Input
                          type="date"
                          min={today}
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="font-[Inter]"
                          data-testid="input-pickup-date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-[Inter] font-medium">Delivery Date</Label>
                        <Input
                          type="date"
                          min={minDeliveryDate}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="font-[Inter]"
                          data-testid="input-delivery-date"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferred Time Slot
                      </Label>
                      <RadioGroup value={timeSlot} onValueChange={setTimeSlot}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {timeSlots.map((slot) => (
                            <div key={slot} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={slot}
                                id={slot}
                                data-testid={`radio-timeslot-${slot.replace(/\s/g, "-")}`}
                              />
                              <Label htmlFor={slot} className="font-[Inter] cursor-pointer">
                                {slot}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-[Poppins] flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-[Inter] font-medium">Street Address</Label>
                      <Input
                        placeholder="Enter your street address"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="font-[Inter]"
                        data-testid="input-street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="font-[Inter] font-medium">City</Label>
                        <Input
                          placeholder="City"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="font-[Inter]"
                          data-testid="input-city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-[Inter] font-medium">State</Label>
                        <Input
                          placeholder="State"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="font-[Inter]"
                          data-testid="input-state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-[Inter] font-medium">Pincode</Label>
                        <Input
                          placeholder="Pincode"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="font-[Inter]"
                          data-testid="input-pincode"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-[Poppins] flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div
                          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                            paymentMethod === "online" ? "border-[#0077FF] bg-[#0077FF]/5" : ""
                          }`}
                          onClick={() => setPaymentMethod("online")}
                        >
                          <RadioGroupItem value="online" id="online" data-testid="radio-online" />
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-[#0077FF]" />
                            <div>
                              <Label htmlFor="online" className="font-[Inter] font-medium cursor-pointer">
                                Pay Online (Razorpay)
                              </Label>
                              <p className="text-sm text-muted-foreground font-[Inter]">
                                UPI, Cards, Net Banking
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                            paymentMethod === "cod" ? "border-[#0077FF] bg-[#0077FF]/5" : ""
                          }`}
                          onClick={() => setPaymentMethod("cod")}
                        >
                          <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
                          <div className="flex items-center gap-3">
                            <Banknote className="h-5 w-5 text-[#0077FF]" />
                            <div>
                              <Label htmlFor="cod" className="font-[Inter] font-medium cursor-pointer">
                                Cash on Delivery
                              </Label>
                              <p className="text-sm text-muted-foreground font-[Inter]">
                                Pay when your clothes are delivered
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                    disabled={step === 1 && items.length === 0}
                    data-testid="button-next"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitOrder}
                    className="bg-[#FFC107] text-black font-[Poppins] font-semibold"
                    disabled={isSubmitting}
                    data-testid="button-place-order"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-[Poppins] flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <p className="text-muted-foreground font-[Inter] text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {items.map((item, index) => (
                          <div
                            key={`${item.garment}-${item.serviceType}`}
                            className="flex items-center justify-between py-2 border-b"
                          >
                            <div className="flex-1">
                              <p className="font-[Inter] text-sm text-foreground">
                                {item.garment}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.serviceType} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-[Poppins] text-sm">
                                ₹{item.price * item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => removeItem(item.garment, item.serviceType)}
                                data-testid={`button-remove-${index}`}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="font-[Inter]"
                            data-testid="input-coupon"
                          />
                          <Button variant="outline" onClick={handleApplyCoupon} data-testid="button-apply-coupon">
                            Apply
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex justify-between font-[Inter] text-sm">
                          <span>Subtotal</span>
                          <span>₹{totalAmount}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between font-[Inter] text-sm text-green-600">
                            <span>Discount</span>
                            <span>-₹{discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-[Inter] text-sm">
                          <span>Delivery</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between font-[Poppins] font-semibold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span className="text-[#0077FF]">₹{finalAmount}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
