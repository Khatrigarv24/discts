// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  ShieldCheck, Activity, BarChart3, Clock, Package,
  LayoutDashboard, Laptop, ChevronRight, Database, AlertCircle,
  Layers, IndianRupee
} from 'lucide-react';
import { getAllProducts } from '../services/inventoryService';

const Home = () => {
  const { isSignedIn } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data for dashboard preview if signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchPreviewData();
    }
  }, [isSignedIn]);

  const fetchPreviewData = async () => {
    try {
      const products = await getAllProducts();
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
      const lowStock = products.filter(product => product.stock < 10).length;

      setDashboardData({
        totalProducts: products.length,
        totalValue: totalValue,
        lowStock: lowStock
      });
    } catch (err) {
      console.error("Error loading preview data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl font-bold text-foreground mb-2 leading-tight">DISCTS</h1>
            <h2 className="text-3xl font-semibold mb-6 leading-tight bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
              Smart Pharmaceutical <br /> Inventory Management
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Streamline your pharmacy operations with our comprehensive drug inventory tracking system that ensures compliance and reduces waste.
            </p>

            {isSignedIn ? (
              <Link
                to="/inventory"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                <Package className="mr-2 h-5 w-5" />
                Access Inventory
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <div>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <p className="text-destructive font-medium flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Authentication required for access to pharmaceutical inventory
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    to="/about"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                  >
                    Learn More
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a
                    href="#features"
                    className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center"
                  >
                    See Features
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            {/* Main feature visual */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 shadow-xl border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 h-24 w-24 bg-primary/5 rounded-full -ml-12 -mb-12"></div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-background p-4 rounded-lg shadow-md border border-border flex flex-col items-center transform transition-transform hover:scale-105">
                  <Activity className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Real-time Tracking</span>
                </div>
                <div className="bg-background p-4 rounded-lg shadow-md border border-border flex flex-col items-center transform transition-transform hover:scale-105">
                  <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">FDA Compliant</span>
                </div>
                <div className="bg-background p-4 rounded-lg shadow-md border border-border flex flex-col items-center transform transition-transform hover:scale-105">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Expiry Alerts</span>
                </div>
                <div className="bg-background p-4 rounded-lg shadow-md border border-border flex flex-col items-center transform transition-transform hover:scale-105">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
              </div>

              {/* Mock dashboard preview */}
              <div className="mt-8 bg-background rounded-lg border border-border p-4 shadow-inner overflow-hidden">
                <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Dashboard Preview</span>
                </div>

                {isSignedIn ? (
                  loading ? (
                    <div className="h-28 flex items-center justify-center text-xs text-muted-foreground">
                      Loading dashboard data...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Mini stat cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-card border border-border rounded p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">Products</div>
                              <div className="text-sm font-bold">{dashboardData.totalProducts}</div>
                            </div>
                            <div className="bg-primary/10 p-1 rounded-full">
                              <Layers className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="bg-card border border-border rounded p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">Value</div>
                              <div className="text-sm font-bold">₹{dashboardData.totalValue.toFixed(2)}</div>
                            </div>
                            <div className="bg-primary/10 p-1 rounded-full">
                              <IndianRupee className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Low stock indicator */}
                      <div className="bg-card border border-border rounded p-2">
                        <div className="text-xs font-medium mb-1">Low Stock Items</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold">{dashboardData.lowStock}</div>
                          <div className={`text-xs ${dashboardData.lowStock > 0 ? "text-amber-600" : "text-green-600"} font-medium`}>
                            {dashboardData.lowStock > 0 ? "Needs attention" : "All stocked"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="h-28 flex flex-col justify-center items-center text-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      Sign in to see your pharmacy's live dashboard
                    </div>
                    <div className="text-[10px] text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded">
                      Real-time inventory analytics
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 mb-12">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg shadow p-6 border border-border text-center transform transition-transform hover:scale-105">
          <div className="text-3xl font-bold text-foreground mb-1">99.9%</div>
          <div className="text-sm text-muted-foreground">Inventory Accuracy</div>
        </div>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg shadow p-6 border border-border text-center transform transition-transform hover:scale-105">
          <div className="text-3xl font-bold text-foreground mb-1">30%</div>
          <div className="text-sm text-muted-foreground">Waste Reduction</div>
        </div>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg shadow p-6 border border-border text-center transform transition-transform hover:scale-105">
          <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
          <div className="text-sm text-muted-foreground">Monitoring</div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Key Pharmaceutical Management Features</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card shadow-lg rounded-lg p-6 border border-border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Expiration Tracking</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Automated alerts for approaching expirations to ensure medication safety and reduce waste.
            </p>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Reduces expired inventory by 87%</span>
              </div>
            </div>
          </div>

          <div className="bg-card shadow-lg rounded-lg p-6 border border-border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Regulatory Compliance</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Built-in features to maintain FDA and DEA compliance for controlled substances.
            </p>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-primary" />
                <span>Audit-ready documentation</span>
              </div>
            </div>
          </div>

          <div className="bg-card shadow-lg rounded-lg p-6 border border-border hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Usage Analytics</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Detailed insights into medication usage patterns to optimize ordering and stock levels.
            </p>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <Laptop className="h-4 w-4 text-green-500" />
                <span>Real-time decision support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg shadow-lg p-8 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-blue-600/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Transform Your Pharmaceutical Inventory Today</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Join forward-thinking pharmacies using DISCTS to optimize inventory, reduce waste, and ensure compliance.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/inventory"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;