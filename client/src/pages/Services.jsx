import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Sparkles, Shield, Star, CheckCircle, ArrowRight } from "lucide-react";

const serviceCategories = [
  {
    id: "wash-fold",
    title: "Wash & Fold",
    icon: Shirt,
    description:
      "Perfect for everyday laundry. We wash, dry, and neatly fold your clothes, ready to be put away.",
    features: [
      "Sorted by color and fabric",
      "Premium detergents used",
      "Neatly folded and packaged",
      "48-hour turnaround",
    ],
    priceRange: "₹49 - ₹99 per kg",
    items: [
      { name: "Regular Clothes (per kg)", price: 49 },
      { name: "Bedsheets (per piece)", price: 79 },
      { name: "Towels (per piece)", price: 39 },
      { name: "Curtains (per kg)", price: 89 },
    ],
  },
  {
    id: "wash-iron",
    title: "Wash & Iron",
    icon: Sparkles,
    description:
      "Complete care for your clothes with professional washing and expert pressing for a crisp, polished look.",
    features: [
      "Gentle wash cycle",
      "Professional steam pressing",
      "Hung on hangers",
      "Individual packaging",
    ],
    priceRange: "₹79 - ₹199 per piece",
    items: [
      { name: "Shirt / T-Shirt", price: 79 },
      { name: "Trousers / Jeans", price: 89 },
      { name: "Kurta / Kurti", price: 99 },
      { name: "Dress", price: 149 },
      { name: "Saree", price: 199 },
    ],
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    icon: Shield,
    description:
      "Specialized cleaning for delicate fabrics, formal wear, and items that require extra care.",
    features: [
      "Solvent-based cleaning",
      "Safe for delicate fabrics",
      "Stain treatment included",
      "Premium packaging",
    ],
    priceRange: "₹199 - ₹999 per piece",
    items: [
      { name: "Blazer / Jacket", price: 349 },
      { name: "Suit (2-piece)", price: 599 },
      { name: "Suit (3-piece)", price: 799 },
      { name: "Overcoat", price: 499 },
      { name: "Wedding Lehenga", price: 999 },
      { name: "Sherwani", price: 799 },
    ],
  },
  {
    id: "premium",
    title: "Premium Wash",
    icon: Star,
    description:
      "Luxury treatment for your finest garments with premium detergents, fabric softeners, and meticulous care.",
    features: [
      "Luxury detergents & softeners",
      "Hand-finished details",
      "Anti-bacterial treatment",
      "Express 24-hour option",
    ],
    priceRange: "₹149 - ₹399 per piece",
    items: [
      { name: "Premium Shirt", price: 149 },
      { name: "Premium Trousers", price: 169 },
      { name: "Silk Items", price: 249 },
      { name: "Cashmere Items", price: 349 },
      { name: "Designer Wear", price: 399 },
    ],
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("wash-fold");

  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-[Poppins] font-bold text-4xl sm:text-5xl text-white mb-4">
            Our Services
          </h1>
          <p className="font-[Inter] text-lg text-white/90 max-w-2xl mx-auto">
            Professional laundry services tailored to your needs. From everyday wash to premium care.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent mb-8">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-[Poppins] font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0077FF] data-[state=active]:to-[#00C2FF] data-[state=active]:text-white"
                  data-testid={`tab-${category.id}`}
                >
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {serviceCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-[#0077FF]/10 to-[#00C2FF]/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center">
                          <category.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="font-[Poppins] text-2xl">
                            {category.title}
                          </CardTitle>
                          <p className="font-[Poppins] font-semibold text-[#0077FF] mt-1">
                            {category.priceRange}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="font-[Inter] text-muted-foreground mb-6">
                        {category.description}
                      </p>
                      <h4 className="font-[Poppins] font-semibold text-foreground mb-3">
                        What's Included:
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {category.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-[#0077FF] flex-shrink-0" />
                            <span className="font-[Inter] text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/booking">
                        <Button
                          className="w-full bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white font-[Poppins] font-medium"
                          data-testid={`button-book-${category.id}`}
                        >
                          Book This Service
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-[Poppins]">Price List</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 font-[Poppins] font-semibold text-foreground">
                                Item
                              </th>
                              <th className="text-right py-3 font-[Poppins] font-semibold text-foreground">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.items.map((item, index) => (
                              <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-muted/30" : ""}
                              >
                                <td className="py-3 px-2 font-[Inter] text-foreground">
                                  {item.name}
                                </td>
                                <td className="py-3 px-2 text-right font-[Poppins] font-semibold text-[#0077FF]">
                                  ₹{item.price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#0077FF] via-[#00A8E8] to-[#00C2FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[Poppins] font-semibold text-3xl text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="font-[Inter] text-white/90 max-w-xl mx-auto mb-8">
            Book your first pickup today and experience the Pulito Wash difference.
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-[#FFC107] text-black font-[Poppins] font-semibold px-10 border-[#FFC107]"
              data-testid="button-book-now-cta"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
