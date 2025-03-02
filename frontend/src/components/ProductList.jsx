// src/components/ProductList.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

const ProductList = ({ products, onUpdateStock, onDeleteProduct, loading }) => {
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState(0);
  const [deleteError, setDeleteError] = useState(null);

  const handleEditStock = (product) => {
    setEditingStockId(product.productId);
    setStockValue(product.stock);
  };

  const handleSaveStock = (productId) => {
    onUpdateStock(productId, stockValue);
    setEditingStockId(null);
  };

  const handleDelete = async (productId) => {
    try {
      setDeleteError(null);
      await onDeleteProduct(productId);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(`Failed to delete: ${error.message}`);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No products available
      </div>
    );
  }

  return (
    <div>
      {deleteError && (
        <div className="bg-destructive/20 text-destructive border border-destructive p-3 mb-4 rounded-md text-sm">
          {deleteError}
        </div>
      )}
      
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
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveStock(product.productId)}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <span>{product.stock}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                ₹{product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditStock(product)}
                  disabled={loading || editingStockId === product.productId}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost" 
                  onClick={() => onDeleteProduct(product)}
                  className="text-destructive hover:text-destructive/80" 
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;