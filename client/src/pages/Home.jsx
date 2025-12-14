import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shirt,
  Sparkles,
  Clock,
  Truck,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Shirt,
    title: "Wash & Fold",
    description: "Professional washing and neatly folded clothes ready to wear.",
    price: "From ₹49/kg",
  },
  {
    icon: Sparkles,
    title: "Wash & Iron",
    description: "Complete wash with expert pressing for a crisp, fresh look.",
    price: "From ₹79/piece",
  },
  {
    icon: Shield,
    title: "Dry Cleaning",
    description: "Specialized care for delicate fabrics and formal wear.",
    price: "From ₹199/piece",
  },
  {
    icon: Star,
    title: "Premium Wash",
    description: "Luxury treatment with premium detergents and fabric care.",
    price: "From ₹149/piece",
  },
];

const steps = [
  {
    number: "1",
    title: "Schedule Pickup",
    description: "Book a convenient time slot for us to collect your laundry.",
  },
  {
    number: "2",
    title: "We Clean",
    description: "Your clothes are expertly cleaned with premium care.",
  },
  {
    number: "3",
    title: "Delivery",
    description: "Fresh, clean clothes delivered right to your doorstep.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Working Professional",
    rating: 5,
    content:
      "Pulito Wash has been a lifesaver! The quality is exceptional and the delivery is always on time.",
  },
  {
    name: "Rahul Mehta",
    role: "Business Owner",
    rating: 5,
    content:
      "Best laundry service I've used. My shirts come back perfectly pressed every single time.",
  },
  {
    name: "Anita Patel",
    role: "Homemaker",
    rating: 5,
    content:
      "Love the convenience and the care they take with delicate fabrics. Highly recommended!",
  },
];

const features = [
  { icon: Truck, text: "Free Pickup & Delivery" },
  { icon: Clock, text: "24-48 Hour Turnaround" },
  { icon: Shield, text: "Quality Guaranteed" },
  { icon: Sparkles, text: "Eco-Friendly Products" },
];

export default function Home() {
  return (
    <Layout>
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="font-[Poppins] font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Premium Laundry Service at Your Doorstep
            </h1>
            <p className="font-[Inter] text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Experience the convenience of professional laundry care. We pick up, clean,
              and deliver your clothes fresh and ready to wear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-[#FFC107] text-black font-[Poppins] font-semibold px-8 py-6 text-lg border-[#FFC107]"
                  data-testid="button-book-now-hero"
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 font-[Poppins] font-medium px-8 py-6 text-lg"
                  data-testid="button-view-pricing-hero"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <feature.icon className="h-5 w-5" />
                  <span className="font-[Inter] text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-[Poppins] font-semibold text-3xl sm:text-4xl text-foreground mb-4">
              Our Services
            </h2>
            <p className="font-[Inter] text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of professional laundry services tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover-elevate transition-all duration-300"
                data-testid={`card-service-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-[Poppins] font-semibold text-lg text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="font-[Inter] text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <p className="font-[Poppins] font-semibold text-[#0077FF]">
                    {service.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services">
              <Button
                variant="outline"
                className="font-[Poppins] font-medium"
                data-testid="button-view-all-services"
              >
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-[Poppins] font-semibold text-3xl sm:text-4xl text-foreground mb-4">
              How It Works
            </h2>
            <p className="font-[Inter] text-muted-foreground max-w-2xl mx-auto">
              Getting your laundry done has never been easier. Just 3 simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
                data-testid={`step-${index + 1}`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center mb-6 shadow-lg">
                  <span className="font-[Poppins] font-bold text-2xl text-white">
                    {step.number}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#0077FF] to-[#00C2FF]" />
                )}
                <h3 className="font-[Poppins] font-semibold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-[Inter] text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-[Poppins] font-semibold text-3xl sm:text-4xl text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="font-[Inter] text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Pulito Wash.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover-elevate"
                data-testid={`testimonial-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-[#FFC107] text-[#FFC107]"
                      />
                    ))}
                  </div>
                  <p className="font-[Inter] text-foreground mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-[Poppins] font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="font-[Inter] text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0077FF] via-[#00A8E8] to-[#00C2FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[Poppins] font-semibold text-3xl sm:text-4xl text-white mb-4">
            Ready to Experience Premium Laundry Care?
          </h2>
          <p className="font-[Inter] text-white/90 max-w-2xl mx-auto mb-8">
            Schedule your first pickup today and enjoy fresh, clean clothes delivered to
            your doorstep.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              "Free Pickup & Delivery",
              "48-Hour Turnaround",
              "Satisfaction Guaranteed",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-[Inter]">{benefit}</span>
              </div>
            ))}
          </div>
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-[#FFC107] text-black font-[Poppins] font-semibold px-10 py-6 text-lg border-[#FFC107]"
              data-testid="button-schedule-pickup"
            >
              Schedule Pickup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
