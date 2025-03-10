import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createInvoice, getInvoiceById, getAllInvoices, getInvoicesByCustomer, downloadInvoicePdf, deleteInvoice } from './invoice-controller';

const invoiceRoutes = new Hono();

// Enable CORS
invoiceRoutes.use('*', cors());

// Define Invoice Routes
invoiceRoutes.post('/create', createInvoice);
invoiceRoutes.get('/all', getAllInvoices);
invoiceRoutes.delete('delete/:id', deleteInvoice);
invoiceRoutes.get('/customer/:customerId', getInvoicesByCustomer);
invoiceRoutes.get('/:id', getInvoiceById);
invoiceRoutes.get('/:id/pdf', downloadInvoicePdf);

export { invoiceRoutes };