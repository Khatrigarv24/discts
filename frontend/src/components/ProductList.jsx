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
      <div className="text-center py-8 text-muted-foreground">
        No products available
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {products.map((product) => (
          <tr key={product.productId}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
              {product.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {editingStockId === product.productId ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={stockValue}
                    onChange={(e) => setStockValue(Number(e.target.value))}
                    className="bg-background border border-input rounded py-1 px-2 text-foreground w-20"
                    min="0"
                  />
                  <button
                    onClick={() => handleSaveStock(product.productId)}
                    className="text-primary hover:text-primary/80"
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span>{product.stock}</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              ${product.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => handleEditStock(product)}
                className="text-primary hover:text-primary/80 mr-4"
                disabled={loading || editingStockId === product.productId}
              >
                Edit Stock
              </button>
              <button
                onClick={() => onDeleteProduct(product.productId)}
                className="text-destructive hover:text-destructive/80"
                disabled={loading}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;