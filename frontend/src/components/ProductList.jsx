// src/components/ProductList.jsx
import React, { useState } from 'react';

const ProductList = ({ products, onUpdateStock, onDeleteProduct, loading }) => {
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState(0);
  
  const handleEditStock = (product) => {
    setEditingStockId(product.productId);
    setStockValue(product.stock);
  };
  
  const handleSaveStock = (productId) => {
    onUpdateStock(productId, stockValue);
    setEditingStockId(null);
  };
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No products available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
          {products.map((product) => (
            <tr key={product.productId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {editingStockId === product.productId ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(Number(e.target.value))}
                      className="shadow border rounded py-1 px-2 text-gray-700 w-20"
                      min="0"
                    />
                    <button
                      onClick={() => handleSaveStock(product.productId)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      disabled={loading}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span>{product.stock}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEditStock(product)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  disabled={loading || editingStockId === product.productId}
                >
                  Edit Stock
                </button>
                <button
                  onClick={() => onDeleteProduct(product.productId)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;