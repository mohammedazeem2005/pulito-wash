import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shirt, Sparkles, Shield, Star, Search, ArrowRight } from "lucide-react";

const pricingData = {
  "wash-fold": {
    title: "Wash & Fold",
    icon: Shirt,
    items: [
      { garment: "Regular Clothes", unit: "per kg", price: 49 },
      { garment: "Jeans / Denims", unit: "per kg", price: 69 },
      { garment: "Bedsheet (Single)", unit: "per piece", price: 59 },
      { garment: "Bedsheet (Double)", unit: "per piece", price: 79 },
      { garment: "Pillow Cover", unit: "per piece", price: 29 },
      { garment: "Blanket (Single)", unit: "per piece", price: 149 },
      { garment: "Blanket (Double)", unit: "per piece", price: 199 },
      { garment: "Comforter", unit: "per piece", price: 299 },
      { garment: "Towel (Small)", unit: "per piece", price: 29 },
      { garment: "Towel (Large)", unit: "per piece", price: 49 },
      { garment: "Curtains", unit: "per kg", price: 89 },
      { garment: "Table Cloth", unit: "per piece", price: 69 },
    ],
  },
  "wash-iron": {
    title: "Wash & Iron",
    icon: Sparkles,
    items: [
      { garment: "Shirt", unit: "per piece", price: 79 },
      { garment: "T-Shirt", unit: "per piece", price: 69 },
      { garment: "Trousers", unit: "per piece", price: 89 },
      { garment: "Jeans", unit: "per piece", price: 99 },
      { garment: "Shorts", unit: "per piece", price: 59 },
      { garment: "Kurta", unit: "per piece", price: 99 },
      { garment: "Kurti", unit: "per piece", price: 89 },
      { garment: "Dress", unit: "per piece", price: 149 },
      { garment: "Skirt", unit: "per piece", price: 99 },
      { garment: "Saree (Cotton)", unit: "per piece", price: 149 },
      { garment: "Saree (Silk)", unit: "per piece", price: 249 },
      { garment: "Salwar Suit", unit: "per set", price: 199 },
      { garment: "Kids Clothes", unit: "per piece", price: 49 },
    ],
  },
  "dry-cleaning": {
    title: "Dry Cleaning",
    icon: Shield,
    items: [
      { garment: "Blazer", unit: "per piece", price: 349 },
      { garment: "Jacket (Light)", unit: "per piece", price: 299 },
      { garment: "Jacket (Heavy)", unit: "per piece", price: 449 },
      { garment: "Suit (2-piece)", unit: "per set", price: 599 },
      { garment: "Suit (3-piece)", unit: "per set", price: 799 },
      { garment: "Overcoat", unit: "per piece", price: 499 },
      { garment: "Leather Jacket", unit: "per piece", price: 699 },
      { garment: "Wedding Lehenga", unit: "per piece", price: 999 },
      { garment: "Sherwani", unit: "per piece", price: 799 },
      { garment: "Gown (Party)", unit: "per piece", price: 599 },
      { garment: "Gown (Wedding)", unit: "per piece", price: 999 },
      { garment: "Woolen Sweater", unit: "per piece", price: 249 },
      { garment: "Tie", unit: "per piece", price: 99 },
    ],
  },
  premium: {
    title: "Premium Wash",
    icon: Star,
    items: [
      { garment: "Premium Shirt", unit: "per piece", price: 149 },
      { garment: "Premium T-Shirt", unit: "per piece", price: 129 },
      { garment: "Premium Trousers", unit: "per piece", price: 169 },
      { garment: "Silk Saree", unit: "per piece", price: 349 },
      { garment: "Silk Shirt", unit: "per piece", price: 249 },
      { garment: "Cashmere Sweater", unit: "per piece", price: 349 },
      { garment: "Designer Dress", unit: "per piece", price: 399 },
      { garment: "Embroidered Kurta", unit: "per piece", price: 299 },
      { garment: "Velvet Items", unit: "per piece", price: 299 },
      { garment: "Linen Shirt", unit: "per piece", price: 199 },
      { garment: "Premium Kids Wear", unit: "per piece", price: 129 },
    ],
  },
};

export default function Pricing() {
  const [activeTab, setActiveTab] = useState("wash-fold");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = pricingData[activeTab].items.filter((item) =>
    item.garment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <section className="relative py-20 bg-gradient-to-br from-[#0077FF]/90 via-[#00A8E8]/80 to-[#00C2FF]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-[Poppins] font-bold text-4xl sm:text-5xl text-white mb-4">
            Transparent Pricing
          </h1>
          <p className="font-[Inter] text-lg text-white/90 max-w-2xl mx-auto">
            Clear, upfront pricing with no hidden charges. Quality service at competitive rates.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent mb-8">
              {Object.keys(pricingData).map((key) => {
                const category = pricingData[key];
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-[Poppins] font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0077FF] data-[state=active]:to-[#00C2FF] data-[state=active]:text-white"
                    data-testid={`pricing-tab-${key}`}
                  >
                    <Icon className="h-5 w-5" />
                    {category.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <Card className="mb-8">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for a garment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-[Inter]"
                    data-testid="input-search-garment"
                  />
                </div>
              </CardContent>
            </Card>

            {Object.keys(pricingData).map((key) => {
              const Icon = pricingData[key].icon;
              return (
                <TabsContent key={key} value={key}>
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-[#0077FF]/5 to-[#00C2FF]/5">
                      <CardTitle className="flex items-center gap-3 font-[Poppins]">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {pricingData[key].title} Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full" data-testid="pricing-table">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              <th className="text-left py-4 px-6 font-[Poppins] font-semibold text-foreground">
                                Garment
                              </th>
                              <th className="text-center py-4 px-6 font-[Poppins] font-semibold text-foreground">
                                Unit
                              </th>
                              <th className="text-right py-4 px-6 font-[Poppins] font-semibold text-foreground">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.length > 0 ? (
                              filteredItems.map((item, index) => (
                                <tr
                                  key={index}
                                  className={`border-b border-border last:border-0 ${
                                    index % 2 === 0 ? "" : "bg-muted/20"
                                  }`}
                                  data-testid={`pricing-row-${index}`}
                                >
                                  <td className="py-4 px-6 font-[Inter] text-foreground">
                                    {item.garment}
                                  </td>
                                  <td className="py-4 px-6 text-center font-[Inter] text-muted-foreground">
                                    {item.unit}
                                  </td>
                                  <td className="py-4 px-6 text-right font-[Poppins] font-semibold text-[#0077FF]">
                                    ₹{item.price}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-8 px-6 text-center font-[Inter] text-muted-foreground"
                                >
                                  No items found matching "{searchTerm}"
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="mt-10 text-center">
            <p className="font-[Inter] text-muted-foreground mb-6">
              All prices are inclusive of pickup and delivery charges within city limits.
            </p>
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0077FF] to-[#00C2FF] text-white font-[Poppins] font-semibold"
                data-testid="button-book-now"
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
