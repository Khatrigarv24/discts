// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">About DISCTS</h1>
      
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          DISCTS aims to provide a simple, efficient inventory management system for businesses of all sizes.
          Our platform makes it easy to track stock levels, manage product information, and streamline your
          inventory processes.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Built with modern technologies including React, Tailwind CSS, Hono for the backend API, 
          and AWS DynamoDB for reliable data storage.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Frontend</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
              <li>React</li>
              <li>Tailwind CSS</li>
              <li>Clerk Authentication</li>
              <li>React Router</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Backend</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
              <li>Hono (TypeScript)</li>
              <li>AWS DynamoDB</li>
              <li>AWS SDK</li>
              <li>Node.js</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;