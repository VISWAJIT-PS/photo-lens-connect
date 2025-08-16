import { Camera, MapPin, Package, Star, Users, Zap } from "lucide-react";
import { Button } from "./button";
import { AuthModal } from "./auth-modal";
import rentalImage from "@/assets/rental-equipment.jpg";
import locationImage from "@/assets/photo-location.jpg";

const features = [
  {
    icon: Camera,
    title: "Top Photographers",
    description: "Browse verified professional photographers with portfolios and reviews",
    image: null,
    gradient: "from-blue-500 to-teal-500"
  },
  {
    icon: Package,
    title: "Equipment Rentals", 
    description: "Rent cameras, drones, lighting equipment and studio spaces",
    image: rentalImage,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: MapPin,
    title: "Photo Locations",
    description: "Discover stunning photography locations and book shoots",
    image: locationImage,
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: Star,
    title: "Customer Stories",
    description: "See real customer photos and read authentic reviews",
    image: null,
    gradient: "from-orange-500 to-red-500"
  }
];

const stats = [
  { icon: Users, label: "Active Photographers", value: "500+" },
  { icon: Camera, label: "Events Completed", value: "1,000+" },
  { icon: Star, label: "Average Rating", value: "4.9" },
  { icon: Zap, label: "Response Time", value: "<2hrs" }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="block text-primary">Perfect Photography</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding the right photographer to renting equipment and discovering locations,
            we've got your photography needs covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="card-feature group cursor-pointer">
              {feature.image ? (
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className={`absolute top-4 left-4 p-2 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of happy customers who found their perfect photographer through PhotoLens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthModal defaultTab="register">
                <Button size="lg" className="btn-hero">
                  Book a Photographer
                </Button>
              </AuthModal>
              <AuthModal defaultTab="register">
                <Button size="lg" variant="outline" className="btn-outline-hero">
                  Join as Professional
                </Button>
              </AuthModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};