// src/pages/AboutPage.jsx
import React from 'react';
import { Database, LayoutDashboard, Lock, Settings, Shield, Clock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground">About DISCTS</h1>
      
      <div className="bg-card shadow rounded-lg p-6 mb-8 border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Our Mission</h2>
        <p className="text-muted-foreground mb-4">
          DISCTS aims to provide a simple, efficient inventory management system for businesses of all sizes.
          Our platform makes it easy to track stock levels, manage product information, and streamline your
          inventory processes.
        </p>
        <p className="text-muted-foreground">
          Built with modern technologies including React, Tailwind CSS, Hono for the backend API, 
          and AWS DynamoDB for reliable data storage.
        </p>
      </div>
      
      <div className="bg-card shadow rounded-lg p-6 mb-8 border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <LayoutDashboard className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1 text-card-foreground">Intuitive Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Clean, modern interface for managing your inventory with real-time updates.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Database className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1 text-card-foreground">Scalable Storage</h3>
              <p className="text-sm text-muted-foreground">
                Built on AWS DynamoDB to handle businesses of any size with reliable performance.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1 text-card-foreground">Secure Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard security with Clerk authentication to protect your data.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Settings className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1 text-card-foreground">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Adaptable system that can be tailored to your specific business needs.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card shadow rounded-lg p-6 mb-8 border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Frontend</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>React 19.0</li>
              <li>Tailwind CSS</li>
              <li>Shadcn UI</li>
              <li>Clerk Authentication</li>
              <li>React Router 7.2.0</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Backend</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Hono 4.6.16 (TypeScript)</li>
              <li>AWS DynamoDB</li>
              <li>AWS S3 for storage</li>
              <li>Node.js with TypeScript</li>
              <li>Security: CORS, CSRF protection</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-card shadow rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Get Started</h2>
        <p className="text-muted-foreground mb-4">
          Ready to transform your inventory management? DISCTS is designed to be easy to set up and use.
          Our team is available to help you implement the system in your business with personalized support.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;