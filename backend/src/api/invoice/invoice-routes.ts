import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createInvoice, getInvoiceById, getAllInvoices, getInvoicesByCustomer, downloadInvoicePdf, deleteInvoice } from './invoice-controller';

const invoiceRoutes = new Hono();

// Enable CORS
invoiceRoutes.use('*', cors());

// Define Invoice Routes
invoiceRoutes.post('/create-order', createInvoice);
invoiceRoutes.get('/all-invoices', getAllInvoices);
invoiceRoutes.delete('/delete-invoice/:id', deleteInvoice);
invoiceRoutes.get('/invoice-by-cusID/:customerId', getInvoicesByCustomer);
invoiceRoutes.get('/invoice/:id', getInvoiceById);
invoiceRoutes.get('/invoice/:id/pdf', downloadInvoicePdf);

export { invoiceRoutes };