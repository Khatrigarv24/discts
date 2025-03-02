// src/components/ProductForm.jsx
import React, { useState } from 'react';

const ProductForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    price: '' 
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value  // Store as string in state
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert to proper types before submitting
    const submissionData = {
      name: formData.name,
      stock: formData.stock === '' ? 0 : Number(formData.stock),
      price: formData.price === '' ? 0 : Number(formData.price)
    };
    onSubmit(submissionData);
    setFormData({ name: '', stock: '', price: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-foreground text-sm font-medium mb-2" htmlFor="name">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
          placeholder='Enter product name'
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-foreground text-sm font-medium mb-2" htmlFor="stock">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          min="0"
          required
          placeholder='Enter stock quantity'
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-foreground text-sm font-medium mb-2" htmlFor="price">
          Price (₹)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          min="0"
          step="0.01"
          required
          placeholder='Enter product price'
        />
      </div>
      
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;