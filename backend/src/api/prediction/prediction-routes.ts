import { Hono } from 'hono'
import { predictionController } from './prediction-controller'

// Create router for prediction endpoints
const predictionRoutes = new Hono()

// Route for sales prediction
predictionRoutes.post('/predict', (c) => predictionController.predictSales(c))

// Health check endpoint
predictionRoutes.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Sales Prediction API is running'
  })
})

export default predictionRoutes;