import { Context } from 'hono'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

// Controller class for sales prediction
export class PredictionController {
  
  /**
   * Predict sales for a given medicine
   * @param c - Hono Context
   * @returns JSON response with prediction
   */
  async predictSales(c: Context): Promise<Response> {
    try {
      // Create a path to the Python script relative to the project root
      const projectRoot = process.cwd(); // Gets the current working directory
      const modelScriptPath = path.join(projectRoot, 'models', 'prediction_script.py');
      
      console.log("Script path:", modelScriptPath);
      console.log("File exists:", fs.existsSync(modelScriptPath));
      
      // Extract required data from request body
      const { productName, year, month } = await c.req.json();
      
      // Validate input
      if (!productName || !year || !month) {
        return c.json({ 
          success: false, 
          error: 'Missing required fields: productName, year, month' 
        }, 400);
      }
      
      // Call Python script for prediction
      const predicted = await this.runPrediction(modelScriptPath, productName, year, month);
      
      return c.json({ 
        success: true,
        data: {
          product: productName,
          year: year,
          month: month,
          predictedSales: predicted
        }
      });
    } catch (error) {
      console.error('Prediction error:', error);
      return c.json({ 
        success: false, 
        error: 'Failed to process prediction',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }

  /**
   * Run Python prediction script as a child process
   * @param scriptPath - Path to the Python script
   * @param productName - Name of the medicine product
   * @param year - Year for prediction
   * @param month - Month for prediction
   * @returns Promise resolving to the predicted sales value
   */
  private runPrediction(scriptPath: string, productName: string, year: number, month: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        return reject(new Error(`Python script not found at: ${scriptPath}`));
      }
      
      // Spawn Python process
      const pythonProcess = spawn('python', [
        scriptPath,
        productName,
        year.toString(),
        month
      ]);
      
      let result = '';
      let errorOutput = '';
      
      // Collect output
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      // Collect errors
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(`Error output: ${errorOutput}`);
          return reject(new Error('Prediction failed: ' + errorOutput));
        }
        
        try {
          // Parse the output to get prediction value
          const predictedSales = parseFloat(result.trim());
          if (isNaN(predictedSales)) {
            return reject(new Error('Invalid prediction result'));
          }
          resolve(predictedSales);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

// Create and export controller instance
export const predictionController = new PredictionController();