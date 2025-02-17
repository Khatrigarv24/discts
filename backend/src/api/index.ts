import { Hono } from 'hono';
import { inventoryRoutes } from './inventory/inventory-routes';
import { connectDB } from './inventory/inventory-services';

const appRouter = new Hono();

// Connect to DB (Ensures table exists)
connectDB();

// Use Inventory Routes
appRouter.route('/inventory', inventoryRoutes);
export default appRouter;