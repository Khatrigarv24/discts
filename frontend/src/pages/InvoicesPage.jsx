import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAllInvoices, 
  createInvoice, 
  deleteInvoice, 
  downloadInvoicePdf, 
  getInvoice 
} from '../services/invoiceService';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceList from '../components/InvoiceList';
import InvoiceView from '../components/InvoiceView';
import { useAuth } from '@clerk/clerk-react';

const InvoicesPage = () => {
  const { isSignedIn } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all invoices on component mount
  useEffect(() => {
    if (isSignedIn) {
      fetchInvoices();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getAllInvoices();
      setInvoices(data);
    } catch (error) {
      toast({
        title: "Error loading invoices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (formData) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create invoices",
        variant: "destructive",
      });
      return;
    }
    
    setFormLoading(true);
    try {
      const response = await createInvoice(formData);
      toast({
        title: "Invoice Created",
        description: "Invoice has been created successfully",
      });
      
      // Add the new invoice to the list and switch to the list view
      setInvoices([response.invoice, ...invoices]);
      setActiveTab('all');
    } catch (error) {
      toast({
        title: "Error creating invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewInvoice = async (invoice) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view invoices",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If we don't have the full invoice details (including PDF), fetch it
      if (!invoice.pdf) {
        const response = await getInvoice(invoice.invoiceId);
        setSelectedInvoice(response.invoice);
      } else {
        setSelectedInvoice(invoice);
      }
      setIsViewModalOpen(true);
    } catch (error) {
      toast({
        title: "Error loading invoice details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDownloadInvoice = async (invoiceId) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download invoices",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const blob = await downloadInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your invoice PDF is downloading",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete invoices",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteInvoice(invoiceId);
      
      // Remove the deleted invoice from the list
      setInvoices(invoices.filter(inv => inv.invoiceId !== invoiceId));
      
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw for the InvoiceList component to handle
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage customer invoices and orders</p>
        </div>
        {isSignedIn && (
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => setActiveTab('create')}
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        )}
      </div>

      {!isSignedIn ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-destructive font-medium flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Please sign in to manage invoices
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border px-4">
              <TabsList className="h-14">
                <TabsTrigger value="all" className="data-[state=active]:bg-background">
                  <FileText className="h-4 w-4 mr-2" />
                  All Invoices
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading invoices...</p>
                </div>
              ) : (
                <InvoiceList 
                  invoices={invoices}
                  onViewInvoice={handleViewInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                  onDownloadInvoice={handleDownloadInvoice}
                  loading={loading}
                />
              )}
            </TabsContent>

            <TabsContent value="create" className="p-4">
              <div className="max-w-3xl mx-auto">
                <InvoiceForm 
                  onSubmit={handleCreateInvoice}
                  loading={formLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Invoice View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="w-full max-w-5xl">
            <InvoiceView 
              invoice={selectedInvoice}
              onClose={handleCloseViewModal}
              onDownload={handleDownloadInvoice}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;