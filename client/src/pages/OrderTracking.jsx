import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Download,
  Star,
  ArrowLeft,
  Loader2,
} from "lucide-react";

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

const statusIcons = {
  "Order Placed": Package,
  "Picked Up": Truck,
  "Processing": Clock,
  "Washing": Clock,
  "Ironing": Clock,
  "Ready": CheckCircle,
  "Out for Delivery": Truck,
  "Delivered": CheckCircle,
};

export default function OrderTracking() {
  const [, params] = useRoute("/orders/:id");
  const orderId = params?.id;
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => apiRequest("POST", "/api/reviews", reviewData),
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your review has been submitted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        title: "Please rate",
        description: "Select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate({
      orderId,
      userId: order?.userId,
      rating,
      feedback,
    });
  };

  const handleDownloadInvoice = async () => {
    toast({
      title: "Downloading...",
      description: "Your invoice is being prepared.",
    });
  };

  const currentStatusIndex = order ? ORDER_STATUSES.indexOf(order.orderStatus) : 0;

  if (isLoading) {
    return (
      <Layout>
        <section className="py-8 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="font-[Poppins] font-semibold text-2xl text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="font-[Inter] text-muted-foreground mb-6">
            We couldn't find this order.
          </p>
          <Link href="/orders">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/orders" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-[Inter]">Back to Orders</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-[Poppins] font-bold text-3xl text-white">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="font-[Inter] text-white/80 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/30"
              onClick={handleDownloadInvoice}
              data-testid="button-download-invoice"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-[Poppins]">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="hidden sm:flex justify-between mb-2">
                  {ORDER_STATUSES.map((status, index) => {
                    const Icon = statusIcons[status] || Clock;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    return (
                      <div
                        key={status}
                        className="flex flex-col items-center"
                        style={{ width: `${100 / ORDER_STATUSES.length}%` }}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#0077FF] to-[#00C2FF]"
                              : "bg-muted"
                          } ${isCurrent ? "ring-4 ring-[#0077FF]/30" : ""}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isCompleted ? "text-white" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs text-center font-[Inter] ${
                            isCompleted ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                  <div
                    className="h-full bg-gradient-to-r from-[#0077FF] to-[#00C2FF] transition-all duration-500"
                    style={{
                      width: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="sm:hidden space-y-4">
                  {ORDER_STATUSES.map((status, index) => {
                    const Icon = statusIcons[status] || Clock;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    return (
                      <div
                        key={status}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isCurrent ? "bg-[#0077FF]/10" : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#0077FF] to-[#00C2FF]"
                              : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isCompleted ? "text-white" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-[Inter] ${
                            isCompleted ? "text-foreground" : "text-muted-foreground"
                          } ${isCurrent ? "font-semibold" : ""}`}
                        >
                          {status}
                        </span>
                        {isCurrent && (
                          <Badge className="ml-auto bg-[#0077FF] text-white">
                            Current
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-[Poppins] text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between font-[Inter] text-sm">
                      <span>
                        {item.garment} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between font-[Inter] text-sm">
                    <span>Subtotal</span>
                    <span>₹{order.amount}</span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between font-[Inter] text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-[Poppins] font-semibold">
                    <span>Total</span>
                    <span className="text-[#0077FF]">
                      ₹{Number(order.amount) - Number(order.discount || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-[Poppins] text-lg">Delivery Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[Inter] text-sm font-medium">Delivery Address</p>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.state} - {order.address?.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[Inter] text-sm font-medium">Schedule</p>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      Pickup: {order.pickupDate} | Delivery: {order.deliveryDate}
                    </p>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      Time Slot: {order.timeSlot}
                    </p>
                  </div>
                </div>
                {order.deliveryAgent && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-[Inter] text-sm font-medium">Delivery Agent</p>
                      <p className="font-[Inter] text-sm text-muted-foreground">
                        {order.deliveryAgent}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {order.orderStatus === "Delivered" && (
            <Card>
              <CardHeader>
                <CardTitle className="font-[Poppins] text-lg">Rate Your Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                      data-testid={`star-${star}`}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-[#FFC107] text-[#FFC107]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="font-[Inter] font-medium">Your Feedback</Label>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="font-[Inter]"
                    data-testid="input-feedback"
                  />
                </div>
                <Button
                  onClick={handleSubmitReview}
                  className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white"
                  disabled={reviewMutation.isPending}
                  data-testid="button-submit-review"
                >
                  {reviewMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
