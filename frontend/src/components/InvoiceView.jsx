import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

const InvoiceView = ({ invoice, onDownload, onClose }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!invoice) return null;

  return (
    <div className="bg-background border border-border rounded-md shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Invoice</h2>
          <p className="text-muted-foreground">#{invoice.invoiceId}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(invoice.invoiceId)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Billed To</h3>
          <p className="font-medium">{invoice.customerName}</p>
          <p>{invoice.customerEmail}</p>
          <p>{invoice.customerPhone}</p>
          <p className="mt-2 text-sm whitespace-pre-line">{invoice.shippingAddress}</p>
        </div>
        
        <div className="text-right">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Invoice Details</h3>
          <p><span className="text-muted-foreground">Date:</span> {formatDate(invoice.createdAt)}</p>
          <p><span className="text-muted-foreground">Payment Method:</span> <span className="capitalize">{invoice.paymentMethod}</span></p>
          <p className="mt-2"><span className="text-muted-foreground">Status:</span> <span className="text-green-600 font-medium">Completed</span></p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium border-b border-border pb-2 mb-4">Invoice Items</h3>
        <table className="w-full">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left py-3">Item</th>
              <th className="text-center py-3">Qty</th>
              <th className="text-right py-3">Price</th>
              <th className="text-right py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoice.items?.map((item, index) => (
              <tr key={index}>
                <td className="py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.productId.substring(0, 8)}...</div>
                </td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-3 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-border">
            <tr>
              <td colSpan="3" className="py-3 text-right font-medium">Total:</td>
              <td className="py-3 text-right font-bold">₹{invoice.total?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceView;