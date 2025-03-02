// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Pill, ShieldCheck, Activity, BarChart3, Clock, Package, Beaker, Server } from 'lucide-react';

const Home = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <div className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center mb-4">
              <Pill className="h-10 w-10 text-primary mr-2" strokeWidth={1.5} />
              <h1 className="text-4xl font-bold text-foreground">DISCTS</h1>
            </div>
            <h2 className="text-3xl font-semibold mb-6 text-foreground leading-tight">
              Smart Pharmaceutical <br /> Inventory Management
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Streamline your pharmacy operations with our comprehensive drug inventory tracking system.
            </p>
            
            {isSignedIn ? (
              <Link 
                to="/inventory" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center"
              >
                <Package className="mr-2 h-5 w-5" />
                Access Inventory
              </Link>
            ) : (
              <div>
                <p className="text-destructive font-medium flex items-center mb-4">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Authentication required for access to pharmaceutical inventory
                </p>
                <div className="flex gap-4">
                  <Link 
                    to="/about" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center"
                  >
                    Learn More
                  </Link>
                  <a 
                    href="#features" 
                    className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center"
                  >
                    See Features
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 shadow-lg border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-lg shadow-sm border border-border flex flex-col items-center">
                <Activity className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Real-time</span>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm border border-border flex flex-col items-center">
                <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Compliant</span>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm border border-border flex flex-col items-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Expiry Alerts</span>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm border border-border flex flex-col items-center">
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="py-12 border-t border-border">
        <h2 className="text-2xl font-semibold mb-8 text-foreground">Key Pharmaceutical Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card shadow rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Expiration Tracking</h3>
            </div>
            <p className="text-muted-foreground">
              Automated alerts for approaching expirations to ensure medication safety and reduce waste.
            </p>
          </div>
          
          <div className="bg-card shadow rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Regulatory Compliance</h3>
            </div>
            <p className="text-muted-foreground">
              Built-in features to maintain FDA and DEA compliance for controlled substances.
            </p>
          </div>
          
          <div className="bg-card shadow rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Usage Analytics</h3>
            </div>
            <p className="text-muted-foreground">
              Detailed insights into medication usage patterns to optimize ordering and stock levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;