"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, MapPin, Package, TrendingUp, Camera, Cloud, Users, ArrowRight, Shield } from "lucide-react";

const farmProducts = [
  { name: "Organic Rice", description: "Premium quality organic rice cultivation", icon: "🌾" },
  { name: "Fresh Vegetables", description: "Variety of seasonal vegetables", icon: "🥬" },
  { name: "Fruits", description: "Tropical and subtropical fruits", icon: "🍎" },
  { name: "Herbs", description: "Medicinal and culinary herbs", icon: "🌿" },
];

const features = [
  { title: "Inventory Management", description: "Track seedlings, supplies, and harvest inventory in real-time with smart alerts", icon: Package },
  { title: "Sales Tracking", description: "Monitor harvest sales and revenue with detailed analytics and reports", icon: TrendingUp },
  { title: "Location Management", description: "Manage multiple farm locations with GPS coordinates and area tracking", icon: MapPin },
  { title: "User Roles", description: "Secure access control for admin, operator, and viewer roles", icon: Shield },
  { title: "IoT Integration", description: "Ready for sensor data and automation (Coming Soon)", icon: Cloud },
  { title: "Camera Monitoring", description: "Real-time surveillance and monitoring (Coming Soon)", icon: Camera },
];

const locations = [
  { name: "North Farm", address: "123 Green Valley Road, Springfield", hectares: 50 },
  { name: "South Plantation", address: "456 Harvest Lane, Greenville", hectares: 35 },
  { name: "East Orchard", address: "789 Fruit Avenue, Riverside", hectares: 25 },
  { name: "West Fields", address: "321 Prairie Drive, Meadowbrook", hectares: 40 },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e5e7eb', zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #16a34a, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgriFarm</span>
          </div>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#products" style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Our Products</a>
            <a href="#features" style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Features</a>
            <a href="#locations" style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '500' }}>Locations</a>
          </nav>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/login">
              <Button variant="ghost" style={{ color: '#4b5563' }}>Sign In</Button>
            </Link>
            <Link href="/register">
              <Button style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', border: 'none', color: 'white', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)' }}>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section style={{ paddingTop: '8rem', paddingBottom: '5rem', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '0 1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#dcfce7', borderRadius: '9999px', color: '#15803d', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.5rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
            Modern Farming Solution
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            <span style={{ color: '#1f2937' }}>Smart Farming</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management Platform</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Transform your agricultural business with our comprehensive farming management platform. Track inventory, monitor harvests, and analyze sales—all in one place.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/login">
              <Button style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', border: 'none', color: 'white', padding: '0.75rem 2rem', fontSize: '1.125rem', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)' }}>
                Start Managing <ArrowRight style={{ marginLeft: '0.5rem', width: '20px' }} />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', borderWidth: '2px' }}>Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="products" style={{ padding: '5rem 1rem', background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>What We <span style={{ color: '#16a34a' }}>Farm</span></h2>
          <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>Discover our premium agricultural products grown with sustainable practices</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {farmProducts.map((product, index) => (
              <Card key={index} style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <CardHeader style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{product.icon}</div>
                  <CardTitle style={{ fontSize: '1.25rem' }}>{product.name}</CardTitle>
                </CardHeader>
                <CardContent style={{ textAlign: 'center', paddingTop: '0' }}>
                  <p style={{ color: '#4b5563' }}>{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Platform <span style={{ color: '#16a34a' }}>Features</span></h2>
          <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>Everything you need to manage your farm efficiently</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <Card key={index} style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardHeader>
                  <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #16a34a, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <feature.icon style={{ width: '28px', height: '28px', color: 'white' }} />
                  </div>
                  <CardTitle style={{ fontSize: '1.125rem' }}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" style={{ padding: '5rem 1rem', background: 'linear-gradient(180deg, #f0fdf4 0%, #d1fae5 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Our <span style={{ color: '#16a34a' }}>Locations</span></h2>
          <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>Visit our strategically located farms across the region</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {locations.map((location, index) => (
              <Card key={index} style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '8px', background: 'linear-gradient(90deg, #16a34a, #059669)' }}></div>
                <CardHeader style={{ paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                    </div>
                    <CardTitle style={{ fontSize: '1.125rem' }}>{location.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{location.address}</p>
                  <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: 'linear-gradient(135deg, #16a34a, #059669)', color: 'white', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                    {location.hectares} hectares
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1rem', background: 'linear-gradient(135deg, #16a34a, #047857)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Ready to Transform Your Farm?</h2>
          <p style={{ color: '#d1fae5', marginBottom: '2rem' }}>Join hundreds of farmers who have already modernized their operations with AgriFarm</p>
          <Link href="/login">
            <Button style={{ backgroundColor: 'white', color: '#16a34a', padding: '0.75rem 2.5rem', fontSize: '1.125rem', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              Get Started Today <ArrowRight style={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
          </Link>
        </div>
      </section>

      <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #16a34a, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AgriFarm</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Modern farming management solution for the digital age.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#products" style={{ color: '#9ca3af', textDecoration: 'none' }}>Our Products</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#features" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a></li>
                <li><a href="#locations" style={{ color: '#9ca3af', textDecoration: 'none' }}>Locations</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Contact</h4>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>info@agrifarm.com</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>+1 234 567 890</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1f2937', marginTop: '2rem', paddingTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            © 2024 AgriFarm. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
