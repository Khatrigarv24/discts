import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { addProduct, updateProductStock, deleteProduct } from '../services/inventoryService';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

const InventoryPage = () => {
  const { isSignedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleAddProduct = async (productData) => {
    if (!isSignedIn) {
      setError('You must be signed in to add products');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await addProduct(productData);
      setProducts([...products, { ...productData, productId: result.productId }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateProductStock(productId, newStock);
      setProducts(products.map(p => 
        p.productId === productId ? { ...p, stock: newStock } : p
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.productId !== productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Inventory Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isSignedIn ? (
        <>
          <ProductForm onSubmit={handleAddProduct} loading={loading} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Product List</h2>
            <ProductList 
              products={products} 
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={handleDeleteProduct}
              loading={loading}
            />
          </div>
        </>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please sign in to manage inventory
        </div>
      )}
    </div>
  );
};

export default InventoryPage;