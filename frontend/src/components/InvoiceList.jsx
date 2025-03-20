import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Eye, Trash2, Download, AlertCircle, FileText,
  CreditCard, Wallet, BanknoteIcon, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const InvoiceList = ({ invoices = [], onDeleteInvoice, onViewInvoice, onDownloadInvoice, loading }) => {
  const [deleteError, setDeleteError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'credit':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <Wallet className="h-4 w-4" />;
      case 'bank':
        return <BanknoteIcon className="h-4 w-4" />;
      default:
        return <BanknoteIcon className="h-4 w-4" />; // Default cash
    }
  };

  // Handle invoice deletion with error handling
  const handleDelete = async (invoiceId) => {
    try {
      setDeleteError(null);
      await onDeleteInvoice(invoiceId);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError(`Failed to delete: ${error.message}`);
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {deleteError && (
        <div className="bg-destructive/20 text-destructive border border-destructive p-3 mb-4 rounded-md text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {deleteError}
        </div>
      )}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          type="search"
          placeholder="Search by customer name or invoice ID..." 
          className="pl-10 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 bg-card border border-border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No invoices found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery ? "Try a different search term" : "Create your first invoice to get started."}
          </p>
        </div>
      )}
      
      {filteredInvoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceId} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">#{invoice.invoiceId.substring(0, 8)}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          {getPaymentIcon(invoice.paymentMethod)}
                          <span className="ml-1 capitalize">{invoice.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{invoice.customerName}</div>
                    <div className="text-xs text-muted-foreground">{invoice.customerEmail}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{formatDate(invoice.createdAt)}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">₹{invoice.total?.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{invoice.items?.length || 0} items</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      "bg-green-100/30 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    )}>
                      Completed
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewInvoice(invoice)}
                        className="text-muted-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDownloadInvoice(invoice.invoiceId)}
                        className="text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost" 
                        onClick={() => handleDelete(invoice.invoiceId)}
                        className="text-destructive hover:text-destructive/80" 
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;