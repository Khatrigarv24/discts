import { Hono } from 'hono';
import { inventoryRoutes} from './inventory/inventory-routes';
import { invoiceRoutes } from './invoice/invoice-routes';
import { connectDB } from './inventory/inventory-services';
import { setupInvoiceTable } from './invoice/invoice-services';
import './cran-jobs';

const appRouter = new Hono();

// Connect to DB (Ensures table exists)
connectDB();
setupInvoiceTable();
// Use Inventory Routes
appRouter.route('/inventory', inventoryRoutes);
appRouter.route('/order', invoiceRoutes);
export default appRouter;