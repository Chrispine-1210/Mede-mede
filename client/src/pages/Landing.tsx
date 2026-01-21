import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Truck, Users, TrendingUp, MapPin, Star, MessageCircle, Clock, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import shopImage from '@assets/generated_images/modern_e-commerce_storefront.png';
import driverImage from '@assets/generated_images/professional_delivery_driver.png';
import adminImage from '@assets/generated_images/admin_dashboard_analytics.png';
import paymentImage from '@assets/generated_images/mobile_payment_interface.png';

export default function Landing() {
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is Mede-Mede Spot legal?",
      answer: "Yes, we operate in compliance with all local regulations for cannabis retail in Malawi. All products are sourced legally and quality-tested."
    },
    {
      question: "How fast is delivery?",
      answer: "We offer same-day delivery within Area 25. Most orders are delivered within 2-3 hours of placement."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Stripe card payments, mobile money (Airtel Money, MTN), cash on delivery, and digital wallets."
    },
    {
      question: "Can I return products?",
      answer: "Yes, all unopened products can be returned within 7 days for a full refund or exchange."
    },
    {
      question: "How does the loyalty program work?",
      answer: "Earn 1 point per MWK spent. Collect points to unlock discounts, free products, and exclusive member benefits."
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely. We use industry-standard encryption and never share your personal data with third parties."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-heading text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  Your Trusted Spot in{" "}
                  <span className="text-primary">Area 25</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
                  Premium cannabis products delivered to your door. Experience quality, 
                  comfort, and community at Mede-Mede Spot. Shop, sell, or earn as a driver.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="/signin">
                  <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-hero-signin">
                    Shop Now
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm" data-testid="button-hero-signup">
                    Join Us
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span>Authentic Products</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={shopImage}
                alt="Modern dispensary"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">15K+</div>
              <p className="text-muted-foreground">Deliveries Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">4.8/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Available Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you want to shop, manage inventory, or earn money delivering orders, 
              Mede-Mede Spot has a place for you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Customer Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-primary/5">
                <img 
                  src={shopImage}
                  alt="Customer shopping"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Customers</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Browse premium products, enjoy fast delivery, earn loyalty points, and join special events.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Premium flower varieties
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Pre-rolled packages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Real-time order tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-secondary/5">
                <img 
                  src={adminImage}
                  alt="Admin dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Store Managers</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Manage inventory, track analytics, set events, and grow your business.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Inventory management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Sales analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Event scheduling
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="hover-elevate overflow-hidden">
              <div className="aspect-video overflow-hidden bg-accent/5">
                <img 
                  src={driverImage}
                  alt="Delivery driver"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">Delivery Partners</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Earn money delivering orders with flexible hours and real-time tracking.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Flexible schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Real-time tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Earn per delivery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Why Choose Mede-Mede Spot?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your comfort and satisfaction are our priorities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Carefully curated cannabis strains and products meeting strict quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and discreet delivery throughout Area 25 with real-time tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  Secure checkout, confidential delivery, and encrypted transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Loyalty Program</h3>
                <p className="text-muted-foreground">
                  Earn points on every purchase and unlock exclusive rewards and discounts.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Community Hub</h3>
                <p className="text-muted-foreground">
                  More than shopping - join our community for events and special gatherings.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Flexible Payments</h3>
                <p className="text-muted-foreground">
                  Multiple payment options including cards, mobile money, and digital wallets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Mede-Mede Spot.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "James Banda",
                role: "Customer",
                text: "Best service in Area 25. Fast delivery and great products!",
                rating: 5
              },
              {
                name: "Mercy Kachale",
                role: "Delivery Partner",
                text: "Flexible work and good earnings. Love working with Mede-Mede!",
                rating: 5
              },
              {
                name: "Michael Phiri",
                role: "Store Manager",
                text: "Excellent analytics tools. My inventory management has never been easier.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={paymentImage}
                  alt="Secure payments"
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-4">
                <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                  Flexible Payment Options
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We support multiple payment methods to make shopping convenient and secure.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Stripe Payment</h3>
                    <p className="text-sm text-muted-foreground">Secure card payments with international support</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mobile Money</h3>
                    <p className="text-sm text-muted-foreground">Pay using your mobile phone wallet</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cash on Delivery</h3>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </div>
              </div>

              <a href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Today
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="cursor-pointer hover-elevate" data-testid={`faq-item-${index}`}>
                <CardContent 
                  className="p-6"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <MessageCircle className={`h-5 w-5 text-primary transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === index && (
                    <p className="text-muted-foreground mt-4">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                Stay Updated
              </h2>
              <p className="text-lg text-muted-foreground">
                Subscribe to our newsletter for exclusive offers, new products, and community updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button 
                size="lg"
                data-testid="button-newsletter-subscribe"
                onClick={() => {
                  if (email) {
                    alert("Thanks for subscribing! Check your email for exclusive offers.");
                    setEmail("");
                  }
                }}
              >
                Subscribe
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                Ready to Experience Quality?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your role and join thousands of satisfied customers, sellers, and delivery partners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signin">
                  <Button size="lg" data-testid="button-cta-signin">
                    Sign In
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" data-testid="button-cta-signup">
                    Create Account
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold">Mede-Mede Spot</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted cannabis delivery service in Area 25, Lilongwe.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/shop" className="hover:text-foreground">Shop</a></li>
                <li><a href="/orders" className="hover:text-foreground">Orders</a></li>
                <li><a href="/events" className="hover:text-foreground">Events</a></li>
                <li><a href="/loyalty" className="hover:text-foreground">Loyalty</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/signin" className="hover:text-foreground">Sign In</a></li>
                <li><a href="/signup" className="hover:text-foreground">Create Account</a></li>
                <li><a href="/settings" className="hover:text-foreground">Account Settings</a></li>
                <li><a href="/analytics" className="hover:text-foreground">Analytics</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="text-foreground">Premium Quality Products</li>
                <li className="text-foreground">Fast Local Delivery</li>
                <li className="text-foreground">Community Focused</li>
                <li className="text-foreground">Licensed & Legal</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Mede-Mede Spot. All rights reserved. Licensed and operating legally in Malawi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
