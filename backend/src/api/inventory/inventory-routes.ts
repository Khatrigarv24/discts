import { Hono } from 'hono';
import { getProductById, addItem, updateStock, deleteItem } from './inventory-controller';

const inventoryRoutes = new Hono();

// Define Routes
inventoryRoutes.post('/', addItem);
inventoryRoutes.get('/:id', getProductById);
inventoryRoutes.put('/update-stock/:id', updateStock);
inventoryRoutes.delete('/delete-item/:id', deleteItem);

export { inventoryRoutes };
