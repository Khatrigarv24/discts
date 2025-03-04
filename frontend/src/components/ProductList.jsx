// src/components/ProductList.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye, AlertCircle, CheckCircle2, Package, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductList = ({ products, onUpdateStock, onDeleteProduct, loading }) => {
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState(0);
  const [deleteError, setDeleteError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);

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
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if a product is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  // Toggle expanded product view
  const toggleExpandProduct = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">No products available</h3>
        <p className="text-muted-foreground mt-2">Add your first product to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {deleteError && (
        <div className="bg-destructive/20 text-destructive border border-destructive p-3 mb-4 rounded-md text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
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
              Batch
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {products.map((product) => (
            <React.Fragment key={product.productId}>
              <tr className={cn(
                "hover:bg-muted/50 transition-colors", 
                expandedProduct === product.productId ? "bg-muted/30" : "",
                isExpiringSoon(product.expiryDate) ? "bg-amber-50/10" : ""
              )}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-start">
                    <div>
                      <div className="text-sm font-medium text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {product.productId.substring(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">{product.batchNumber || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className={cn(
                      "text-sm px-2 py-1 rounded",
                      product.stock <= 5 ? "text-destructive bg-destructive/10" : 
                      product.stock <= 20 ? "text-amber-600 bg-amber-100/30" : 
                      "text-green-600 bg-green-100/30"
                    )}>
                      {product.stock}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  ₹{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    <div className="flex items-center">
                      <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded mr-2">MFG</span>
                      {formatDate(product.manufacturingDate)}
                    </div>
                    <div className="flex items-center">
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded mr-2",
                        isExpiringSoon(product.expiryDate) 
                          ? "bg-amber-100/30 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      )}>
                        EXP
                      </span>
                      {formatDate(product.expiryDate)}
                      {isExpiringSoon(product.expiryDate) && (
                        <AlertCircle className="h-3 w-3 text-amber-500 ml-1" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpandProduct(product.productId)}
                      className="text-muted-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStock(product)}
                      disabled={loading || editingStockId === product.productId}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost" 
                      onClick={() => onDeleteProduct(product)}
                      className="text-destructive hover:text-destructive/80" 
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              {expandedProduct === product.productId && (
                <tr className="bg-muted/20">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-background rounded border border-border">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Package className="h-4 w-4 mr-1" /> 
                          Product Details
                        </h4>
                        <div className="space-y-2 text-muted-foreground">
                          <div><span className="font-medium">Name:</span> {product.name}</div>
                          <div><span className="font-medium">ID:</span> {product.productId}</div>
                          <div><span className="font-medium">Batch:</span> {product.batchNumber}</div>
                        </div>
                      </div>
                      <div className="p-3 bg-background rounded border border-border">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Dates
                        </h4>
                        <div className="space-y-2 text-muted-foreground">
                          <div><span className="font-medium">Manufacturing:</span> {formatDate(product.manufacturingDate)}</div>
                          <div>
                            <span className="font-medium">Expiry:</span> {formatDate(product.expiryDate)}
                            {isExpiringSoon(product.expiryDate) && (
                              <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-amber-100/50 text-amber-700">
                                Expiring Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-background rounded border border-border">
                        <h4 className="font-medium mb-2">Inventory Status</h4>
                        <div className="space-y-2 text-muted-foreground">
                          <div>
                            <span className="font-medium">Stock Level:</span> {' '}
                            <span className={cn(
                              "px-2 py-0.5 rounded",
                              product.stock <= 5 ? "text-destructive bg-destructive/10" : 
                              product.stock <= 20 ? "text-amber-600 bg-amber-100/30" : 
                              "text-green-600 bg-green-100/30"
                            )}>
                              {product.stock} {product.stock <= 5 ? "(Low)" : product.stock <= 20 ? "(Medium)" : "(Good)"}
                            </span>
                          </div>
                          <div><span className="font-medium">Price:</span> ₹{product.price.toFixed(2)}</div>
                          <div><span className="font-medium">Total Value:</span> ₹{(product.price * product.stock).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;