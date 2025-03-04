// src/pages/AboutPage.jsx
import React from 'react';
import {
  Database, LayoutDashboard, Lock, Settings,
  Pill, Shield, Clock, BarChart3, ChevronRight,
  Github, Code, Server, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header with visual elements */}
      <div className="relative mb-12">
        <div className="relative z-10">
          <div className="inline-flex items-center mb-4 bg-primary/10 px-3 py-1 rounded-full">
            <Pill className="h-5 w-5 text-primary mr-2" strokeWidth={1.5} />
            <span className="text-sm font-medium text-primary">Our Story</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">About DISCTS</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-6"></div>
          <p className="text-xl text-muted-foreground">
            Your trusted partner for pharmaceutical inventory management
          </p>
        </div>
      </div>

      {/* Mission with visual accent */}
      <div className="bg-card shadow-lg rounded-lg p-8 mb-12 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-primary/5 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text inline-block">Our Mission</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            DISCTS aims to provide a simple, efficient pharmaceutical inventory management system that ensures compliance and reduces waste.
            Our platform makes it easy to track stock levels, manage medication information, and streamline your
            pharmacy operations.
          </p>
          <div className="bg-muted/50 p-4 rounded-md border border-border">
            <p className="text-muted-foreground flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              Built with modern technologies including React, Tailwind CSS, Hono for the backend API,
              and AWS DynamoDB for reliable data storage.
            </p>
          </div>
        </div>
      </div>

      {/* Key features with hover animations */}
      <div className="bg-card shadow-lg rounded-lg p-8 mb-12 border border-border">
        <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Key Pharmaceutical Management Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-card-foreground">Intuitive Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Clean, modern interface for managing your pharmaceutical inventory with real-time updates and expiration tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-card-foreground">Scalable Storage</h3>
              <p className="text-sm text-muted-foreground">
                Built on AWS DynamoDB to handle pharmacies of any size with reliable performance and data integrity.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-card-foreground">Secure Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard security with Clerk authentication to protect sensitive medication data and ensure compliance.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-card-foreground">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Adaptable system that can be tailored to your pharmacy's specific workflows and regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits section with cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Why Choose DISCTS?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-border transition-all hover:scale-105">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Regulatory Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Stay compliant with FDA and DEA requirements for pharmaceutical inventory management.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-border transition-all hover:scale-105">
            <Clock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Expiration Control</h3>
            <p className="text-sm text-muted-foreground">
              Reduce waste with automated alerts for medications approaching their expiration dates.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-border transition-all hover:scale-105">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Data-Driven Insights</h3>
            <p className="text-sm text-muted-foreground">
              Make informed decisions with detailed analytics about your pharmaceutical inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Technology stack with visual elements */}
      <div className="bg-card shadow-lg rounded-lg p-8 mb-12 border border-border">
        <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Technology Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-primary/5 rounded-full z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Code className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-card-foreground">Frontend</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>React 19.0 with React Router 7.2.0</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Tailwind CSS for responsive design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Shadcn UI component library</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Clerk Authentication</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Lucide React icons</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/5 rounded-full z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Server className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-medium text-card-foreground">Backend</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Hono 4.6.16 with TypeScript</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>AWS DynamoDB for data persistence</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>AWS S3 for secure file storage</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Node.js with TypeScript</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>Security: CORS, CSRF protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action with gradient background */}
      <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg shadow-lg p-8 border border-border relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-blue-600/5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Get Started with DISCTS Today</h2>
          <p className="text-lg mb-6 text-muted-foreground">
            Ready to transform your pharmaceutical inventory management? DISCTS is designed to be easy to set up and use.
            Our team is available to help you implement the system with personalized support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/inventory"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Explore System
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300 inline-flex items-center">
              Contact Support
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="text-center text-muted-foreground py-4 flex items-center justify-center gap-2 border-t border-border mt-8">
        <Github className="h-4 w-4" />
        <a
          href="https://github.com/Abhijat05/discts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:text-primary transition-colors"
        >
          Find us on GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutPage;