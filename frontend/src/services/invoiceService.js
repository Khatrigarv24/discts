const API_URL = 'http://localhost:5000/discts/order';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-csrf-disable': 'true'
  };
};

export const getAllInvoices = async () => {
  const response = await fetch(`${API_URL}/all-invoices`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }
  const data = await response.json();
  return data.invoices || [];
};

export const getInvoice = async (invoiceId) => {
  const response = await fetch(`${API_URL}/invoice/${invoiceId}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch invoice: ${response.statusText}`);
  }
  const data = await response.json();
  return data.invoice || {}; // Match the pattern of other functions
};

export const getInvoicesByCustomer = async (customerId) => {
  const response = await fetch(`${API_URL}/invoice-by-cusID/${customerId}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch customer invoices: ${response.statusText}`);
  }
  const data = await response.json();
  return data.invoices || [];
};

export const createInvoice = async (invoiceData) => {
  const response = await fetch(`${API_URL}/create-order`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(invoiceData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create invoice: ${response.statusText}`);
  }
  return response.json();
};

export const deleteInvoice = async (invoiceId) => {
  const response = await fetch(`${API_URL}/delete-invoice/${invoiceId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete invoice (${response.status}): ${errorText || response.statusText}`);
  }
  return response.json();
};

export const downloadInvoicePdf = async (invoiceId) => {
  const response = await fetch(`${API_URL}/invoice/${invoiceId}/pdf`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error(`Failed to download invoice PDF: ${response.statusText}`);
  }
  return response.blob();
};