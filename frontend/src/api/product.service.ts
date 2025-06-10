import api from './config';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description: string;
  features: string[];
  specifications: Record<string, string>;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/');
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}/`);
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<Product>('/products/', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  },
};

export default productService; 