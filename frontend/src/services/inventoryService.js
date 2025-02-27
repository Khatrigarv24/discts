// src/services/inventoryService.js
const API_URL = 'http://localhost:5000/discts/inventory';

export const getProduct = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  return response.json();
};

export const addProduct = async (product) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add product: ${response.statusText}`);
  }
  return response.json();
};

export const updateProductStock = async (productId, stock) => {
  const response = await fetch(`${API_URL}/update-stock/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update stock: ${response.statusText}`);
  }
  return response.json();
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${API_URL}/delete-item/${productId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
  return response.json();
};