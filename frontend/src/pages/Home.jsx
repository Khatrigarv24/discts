// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Home = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Welcome to DISCTS</h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
        A modern inventory management system
      </p>
      
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Get Started</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Track inventory, manage products, and monitor stock levels with our easy-to-use platform.
        </p>
        
        {isSignedIn ? (
          <Link 
            to="/inventory" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-300"
          >
            Go to Inventory
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-amber-600 dark:text-amber-400">
              Please sign in to access inventory management
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Real-time Stock Updates</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor inventory changes instantly as they happen.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Secure Management</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Built with Clerk authentication to keep your data safe.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">AWS Powered</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Leveraging DynamoDB for scalable and reliable storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;