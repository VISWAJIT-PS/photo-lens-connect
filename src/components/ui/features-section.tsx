import { Camera, MapPin, Package, Star, Users, Zap } from "lucide-react";
import { Button } from "./button";
import { AuthModal } from "./auth-modal";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, FadeIn, SlideIn, ScaleIn, Interactive, Parallax } from "./motion-wrappers";
import { transitions, interactionVariants } from "@/lib/motion";
import rentalImage from "@/assets/rental-equipment.jpg";
import locationImage from "@/assets/photo-location.jpg";
import photographerImage from "@/assets/hero-photographer.jpg";

const features = [
  {
    icon: Camera,
    title: "Top Photographers",
    description: "Browse verified professional photographers with portfolios and reviews",
    image: photographerImage,
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
    image: photographerImage,
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
        <Parallax className="text-center mb-16">
          <SlideIn direction="up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need for
              <span className="block text-primary">Perfect Photography</span>
            </h2>
          </SlideIn>
          <SlideIn direction="up">
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From finding the right photographer to renting equipment and discovering locations,
              we've got your photography needs covered.
            </p>
          </SlideIn>
        </Parallax>

        {/* Features Grid */}
        <StaggerContainer 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20" 
          staggerChildren={0.2}
          delayChildren={0.3}
        >
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <Interactive
                className="card-feature group cursor-pointer h-full"
                whileHover={{ y: -8, transition: transitions.fast }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-40 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={transitions.default}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div 
                    className={`absolute top-4 left-4 p-2 rounded-lg bg-gradient-to-r ${feature.gradient}`}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.h3 
                  className="text-xl font-semibold text-foreground mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  {feature.description}
                </motion.p>
              </Interactive>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats Section */}
        <Parallax>
          <ScaleIn className="bg-card rounded-2xl p-8 md:p-12 shadow-soft border border-border">
            <StaggerContainer 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              staggerChildren={0.15}
              delayChildren={0.2}
            >
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <motion.div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <motion.div 
                      className="text-2xl md:text-3xl font-bold text-foreground mb-1"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn className="text-center mt-12">
              <SlideIn direction="up">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
              </SlideIn>
              <SlideIn direction="up">
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of happy customers who found their perfect photographer through PhotoLens.
                </p>
              </SlideIn>
              <StaggerContainer 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                staggerChildren={0.1}
              >
                <StaggerItem>
                  <AuthModal defaultTab="register">
                    <Interactive>
                      <Button size="lg" className="btn-hero">
                        Book a Photographer
                      </Button>
                    </Interactive>
                  </AuthModal>
                </StaggerItem>
                <StaggerItem>
                  <AuthModal defaultTab="register">
                    <Interactive>
                      <Button size="lg" variant="outline" className="btn-outline-hero">
                        Join as Professional
                      </Button>
                    </Interactive>
                  </AuthModal>
                </StaggerItem>
              </StaggerContainer>
            </FadeIn>
          </ScaleIn>
        </Parallax>
      </div>
    </section>
  );
};