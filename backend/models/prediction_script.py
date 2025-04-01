#!/usr/bin/env python3
import sys
import os
import joblib
import pandas as pd
import numpy as np

# Define the directory where model files are stored
# Adjust the path as needed based on your actual project structure
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))

def preprocess_single_entry(medicine_details, label_encoder, data_columns):
    """Preprocess a single medicine entry to match training data features."""
    medicine_df = pd.DataFrame([medicine_details])

    # Label encode 'Product Name'
    try:
        medicine_df['Product Name'] = label_encoder.transform(medicine_df['Product Name'])
    except ValueError as e:
        # Handle unknown product name
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

    # Convert 'Year' and 'Month' to datetime
    medicine_df['Date'] = pd.to_datetime(medicine_df['Year'].astype(str) + '-' + medicine_df['Month'] + '-01', errors='coerce')
    
    # Check if date conversion was successful
    if medicine_df['Date'].isnull().any():
        print("Error: Invalid date format", file=sys.stderr)
        sys.exit(1)

    # Extract date features
    medicine_df['Year'] = medicine_df['Date'].dt.year
    medicine_df['Month'] = medicine_df['Date'].dt.month
    medicine_df['Day'] = medicine_df['Date'].dt.day
    medicine_df['DayOfWeek'] = medicine_df['Date'].dt.weekday

    # Drop 'Date' column
    medicine_df = medicine_df.drop(columns=['Date'])

    # One-hot encode categorical variables
    medicine_df = pd.get_dummies(medicine_df)

    # Ensure the new data has the same features as training data
    missing_cols = set(data_columns) - set(medicine_df.columns)
    for col in missing_cols:
        medicine_df[col] = 0  # Add missing columns with 0 values

    # Ensure we only keep columns that were in the training data
    shared_cols = set(data_columns).intersection(set(medicine_df.columns))
    medicine_df = medicine_df[list(shared_cols)]
    
    # Ensure column order matches training data
    medicine_df = medicine_df.reindex(columns=data_columns, fill_value=0)

    return medicine_df

def predict_sales_simplified(product_name, year, month):
    """Predict sales for a medicine with just product name, year, and month."""
    # Set default values for fields that don't affect predictions
    medicine_details = {
        "Product Name": product_name,
        "Year": year,
        "Month": month.lower(),  # Convert to lowercase to match format
        "Sales Category": "low",  # Default value
        "Reason": "Flu Season",  # Default value
        "Medicine Type": "Tablet",  # Default value
        "Medicine Category": "Vitemins & Supplements"  # Default value
    }
    
    try:
        # Load trained model, label encoder, and feature columns
        model = joblib.load(os.path.join(MODEL_DIR, "random_forest_model.pkl"))
        label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
        data_columns = joblib.load(os.path.join(MODEL_DIR, "data_columns.pkl"))
    except FileNotFoundError as e:
        print(f"Error: Model file not found - {str(e)}", file=sys.stderr)
        sys.exit(1)

    # Convert dictionary to DataFrame and preprocess
    processed_entry = preprocess_single_entry(medicine_details, label_encoder, data_columns)

    # Predict sales
    predicted_sales = model.predict(processed_entry)[0]
    
    return predicted_sales

if __name__ == "__main__":
    # Check if we have the right number of arguments
    if len(sys.argv) != 4:
        print("Usage: python prediction_script.py <product_name> <year> <month>", file=sys.stderr)
        sys.exit(1)
    
    try:
        product_name = sys.argv[1]
        year = int(sys.argv[2])
        month = sys.argv[3]
        
        # Get prediction
        sales = predict_sales_simplified(product_name, year, month)
        
        # Print only the prediction value (will be captured by Node.js)
        print(sales)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)