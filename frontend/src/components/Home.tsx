import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, Product } from '../api/product.service';
import { authService } from '../api/auth.service';
import './Home.css';

interface Transaction {
  id: number;
  product: Product;
  quantity: number;
  total: number;
  date: string;
}

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    setActiveSection('product-detail');
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const newTransactions = cart.map((item) => ({
      id: Date.now(),
      product: item.product,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
      date: new Date().toISOString(),
    }));
    setTransactions((prev) => [...prev, ...newTransactions]);
    setCart([]);
    setActiveSection('transactions');
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Welcome to Our Store</h2>
            <div className="stats">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p>{products.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Transactions</h3>
                <p>{transactions.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>
                  $
                  {transactions
                    .reduce((total, t) => total + t.total, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="products">
            <h2>Products</h2>
            <div className="product-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <button onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'product-detail':
        return selectedProduct ? (
          <div className="product-detail">
            <h2>{selectedProduct.name}</h2>
            <p>Price: ${selectedProduct.price}</p>
            <p>Stock: {selectedProduct.stock}</p>
            <p>Description: {selectedProduct.description}</p>
            <div className="features">
              <h3>Features:</h3>
              <ul>
                {selectedProduct.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="specifications">
              <h3>Specifications:</h3>
              <ul>
                {Object.entries(selectedProduct.specifications).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
            <button onClick={() => handleAddToCart(selectedProduct)}>
              Add to Cart
            </button>
            <button onClick={() => setActiveSection('products')}>Back</button>
          </div>
        ) : null;
      case 'cart':
        return (
          <div className="cart">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.product.id} className="cart-item">
                      <h3>{item.product.name}</h3>
                      <p>${item.product.price}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <p>
                        Total: ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                  <button onClick={handleCheckout}>Checkout</button>
                </div>
              </>
            )}
          </div>
        );
      case 'transactions':
        return (
          <div className="transactions">
            <h2>Transaction History</h2>
            {transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              <div className="transaction-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <h3>{transaction.product.name}</h3>
                    <p>Quantity: {transaction.quantity}</p>
                    <p>Total: ${transaction.total.toFixed(2)}</p>
                    <p>Date: {new Date(transaction.date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'about':
        return (
          <div className="about">
            <h2>About Us</h2>
            <p>
              Welcome to our store! We offer a wide range of high-quality products
              at competitive prices. Our mission is to provide the best shopping
              experience for our customers.
            </p>
            <p>
              If you have any questions or concerns, please don't hesitate to
              contact us.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <nav>
        <button onClick={() => setActiveSection('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveSection('products')}>Products</button>
        <button onClick={() => setActiveSection('cart')}>
          Cart ({cart.length})
        </button>
        <button onClick={() => setActiveSection('transactions')}>
          Transactions
        </button>
        <button onClick={() => setActiveSection('about')}>About</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Home; 