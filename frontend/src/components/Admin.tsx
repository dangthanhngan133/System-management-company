import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, Product } from '../api/product.service';
import { authService } from '../api/auth.service';
import './Admin.css';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    status: 'active',
    description: '',
    features: [],
    specifications: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct(product);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n').filter((f) => f.trim());
    setNewProduct((prev) => ({ ...prev, features }));
  };

  const handleSpecificationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const specifications = JSON.parse(e.target.value);
      setNewProduct((prev) => ({ ...prev, specifications }));
    } catch (err) {
      // Invalid JSON, ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, newProduct as Product);
      } else {
        await productService.createProduct(newProduct as Product);
      }
      await fetchProducts();
      setSelectedProduct(null);
      setNewProduct({
        name: '',
        price: 0,
        stock: 0,
        status: 'active',
        description: '',
        features: [],
        specifications: {},
      });
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await productService.deleteProduct(productId);
        await fetchProducts();
        setSelectedProduct(null);
      } catch (err) {
        setError('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="admin-container">
      <nav>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main>
        <div className="admin-content">
          <div className="product-form">
            <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  name="status"
                  value={newProduct.status}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      status: e.target.value as 'active' | 'inactive',
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Features (one per line):</label>
                <textarea
                  value={newProduct.features?.join('\n')}
                  onChange={handleFeaturesChange}
                  required
                />
              </div>
              <div>
                <label>Specifications (JSON):</label>
                <textarea
                  value={JSON.stringify(newProduct.specifications, null, 2)}
                  onChange={handleSpecificationsChange}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : selectedProduct ? 'Update' : 'Add'}
              </button>
              {selectedProduct && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedProduct.id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              )}
            </form>
          </div>

          <div className="product-list">
            <h3>Products</h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`product-card ${
                      selectedProduct?.id === product.id ? 'selected' : ''
                    }`}
                    onClick={() => handleProductClick(product)}
                  >
                    <h4>{product.name}</h4>
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock}</p>
                    <p>Status: {product.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin; 