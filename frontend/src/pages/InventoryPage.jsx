import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { addProduct, updateProductStock, deleteProduct, getAllProducts } from '../services/inventoryService';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const InventoryPage = () => {
  const { isSignedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Fetch products on component mount
  useEffect(() => {
    if (isSignedIn) {
      fetchProducts();
    }
  }, [isSignedIn]);
  
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load inventory items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
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
      setIsSheetOpen(false); // Close the sheet after successful add
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

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    const productId = productToDelete.productId;
    setLoading(true);
    setError(null);
    
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.productId !== productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        
        {isSignedIn && (
          <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6">
                <ProductForm onSubmit={handleAddProduct} loading={loading} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {error && (
        <div className="bg-destructive/20 border border-destructive text-destructive-foreground px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isSignedIn ? (
        <div className="bg-card shadow rounded-lg border border-border overflow-hidden">
          {loading && !products.length ? (
            <div className="p-6 text-center text-muted-foreground">Loading inventory items...</div>
          ) : (
            <ProductList 
              products={products} 
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={confirmDeleteProduct}
              loading={loading}
            />
          )}
        </div>
      ) : (
        <div className="bg-secondary/50 border border-secondary text-secondary-foreground px-4 py-3 rounded">
          Please sign in to manage inventory
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-medium">{productToDelete?.name}</span> from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct} 
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryPage;