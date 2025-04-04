import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/inventoryService';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, AlertCircle, Info } from 'lucide-react';

const InvoiceForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ productId: '', quantity: 1, price: 0, name: '' }],
    shippingAddress: '',
    paymentMethod: 'cash'
  });
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [stockWarnings, setStockWarnings] = useState({});
  
  // Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    // If the field is productId, update price and name without allowing price modification
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.productId === value);
      if (selectedProduct) {
        updatedItems[index] = { 
          ...updatedItems[index], 
          productId: value,
          price: selectedProduct.price,
          name: selectedProduct.name
        };
        
        // Reset quantity warnings when product changes
        const updatedWarnings = {...stockWarnings};
        delete updatedWarnings[index];
        setStockWarnings(updatedWarnings);
      }
    } 
    // For quantity changes, update and check stock
    else if (field === 'quantity' && updatedItems[index].productId) {
      updatedItems[index].quantity = value;
      const selectedProduct = products.find(p => p.productId === updatedItems[index].productId);
      
      if (selectedProduct && value > selectedProduct.stock) {
        setStockWarnings({
          ...stockWarnings,
          [index]: `Warning: Ordering ${value} units but only ${selectedProduct.stock} in stock!`
        });
      } else {
        const updatedWarnings = {...stockWarnings};
        delete updatedWarnings[index];
        setStockWarnings(updatedWarnings);
      }
    }
    // Don't allow price changes directly
    else if (field !== 'price') {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0, name: '' }]
    });
  };
  
  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    // Also remove any warnings for this item
    const updatedWarnings = {...stockWarnings};
    delete updatedWarnings[index];
    setStockWarnings(updatedWarnings);
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  const calculateTotal = () => {
    return formData.items.reduce(
      (total, item) => total + (Number(item.price) * Number(item.quantity || 0)), 
      0
    ).toFixed(2);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      total: Number(calculateTotal())
    });
  };
  
  const getProductStockInfo = (productId) => {
    if (!productId) return null;
    const product = products.find(p => p.productId === productId);
    if (!product) return null;
    
    return {
      stock: product.stock,
      status: product.stock <= 5 ? "low" : product.stock <= 20 ? "medium" : "good"
    };
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">Customer Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="customerName">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="customerEmail">
              Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
              placeholder="Enter email address"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="customerPhone">
              Phone Number
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
              placeholder="Enter phone number"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit Card</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground" htmlFor="shippingAddress">
            Shipping Address
          </label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            rows="3"
            className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            placeholder="Enter shipping address"
          ></textarea>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h3 className="text-lg font-medium">Order Items</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addItem}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
        
        {formData.items.map((item, index) => {
          const stockInfo = getProductStockInfo(item.productId);
          
          return (
            <div key={index} className="grid grid-cols-12 gap-2 items-end border border-border rounded-md p-3 bg-card">
              <div className="col-span-12 md:col-span-5 space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Product
                </label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  required
                  disabled={loadingProducts}
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option 
                      key={product.productId} 
                      value={product.productId}
                      disabled={product.stock <= 0}
                    >
                      {product.name} {product.stock <= 0 ? '(Out of stock)' : `(₹${product.price})`}
                    </option>
                  ))}
                </select>
                {stockInfo && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${
                    stockInfo.status === "low" ? "text-destructive" : 
                    stockInfo.status === "medium" ? "text-amber-600" : 
                    "text-green-600"
                  }`}>
                    <Info className="h-3 w-3" />
                    <span>In stock: {stockInfo.stock} units</span>
                  </div>
                )}
              </div>
              
              <div className="col-span-4 md:col-span-2 space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Qty
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  className="bg-background border border-input rounded w-full py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  required
                />
                {stockWarnings[index] && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{stockWarnings[index]}</span>
                  </div>
                )}
              </div>
              
              <div className="col-span-4 md:col-span-3 space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={item.price}
                  readOnly
                  className="bg-muted border border-input rounded w-full py-2 px-3 text-foreground/90 focus:outline-none text-sm cursor-not-allowed"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  <span>Set by inventory system</span>
                </div>
              </div>
              
              <div className="col-span-4 md:col-span-2 text-right">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Subtotal</span>
                <span className="font-medium">₹{(item.price * (item.quantity || 0)).toFixed(2)}</span>
              </div>
              
              <div className="col-span-12 md:col-span-12 lg:col-span-0 mt-2 md:mt-0">
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive/90 -mt-1"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Display overall warning if any item exceeds stock */}
        {Object.keys(stockWarnings).length > 0 && (
          <div className="bg-amber-100/30 border border-amber-300 rounded-md p-3 text-amber-700 text-sm flex items-center gap-2 mt-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-medium">Warning: Low Stock</p>
              <p>Some items in this order exceed available inventory. The order can still be submitted, but stock will be negative after processing.</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t border-border">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Order Total</div>
            <div className="text-2xl font-bold">₹{calculateTotal()}</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {loading ? 'Processing...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;