import { Hono } from 'hono';
import { getItemsById, addItem, updateStock, deleteItem, getAllItems, getSoonToExpire } from './inventory-controller';

const inventoryRoutes = new Hono();

// Define Routes
inventoryRoutes.post('/add', addItem);
inventoryRoutes.get('/items', getAllItems);
inventoryRoutes.get('/expiring-soon', getSoonToExpire);
inventoryRoutes.get('/items/:id', getItemsById);
inventoryRoutes.put('/update-stock/:id', updateStock);
inventoryRoutes.delete('/delete-item/:id', deleteItem);


export { inventoryRoutes };
