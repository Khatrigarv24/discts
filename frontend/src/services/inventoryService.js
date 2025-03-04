// src/services/inventoryService.js
const API_URL = 'http://localhost:5000/discts/inventory';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-csrf-disable': 'true'
  };
};

export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/items`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  const data = await response.json();
  return data.items || [];
};

export const getProduct = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  return response.json();
};

export const addProduct = async (product) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to add product: ${response.statusText}`);
  }
  return response.json();
};

export const updateProductStock = async (productId, stock) => {
  const response = await fetch(`${API_URL}/update-stock/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
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
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete product (${response.status}): ${errorText || response.statusText}`);
  }
  return response.json();
};

export const getSoonToExpire = async () => {
  const response = await fetch(`${API_URL}/expiring-soon`, {
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch expiring products: ${response.statusText}`);
  }
  const data = await response.json();
  return data.items || [];
};