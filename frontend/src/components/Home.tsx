import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import TransactionHistory from './TransactionHistory';
import Checkout from './Checkout';
import './Home.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
}

interface Transaction {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
}

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const products: Product[] = [
    {
      id: 1,
      name: "OxiWater Premium",
      price: 29.99,
      image: "https://via.placeholder.com/150",
      description: "Premium water purification system with advanced filtration",
      features: [
        "Advanced 5-stage filtration",
        "Smart monitoring system",
        "Energy efficient",
        "Easy maintenance"
      ],
      specifications: {
        "Filter Life": "12 months",
        "Flow Rate": "2.5 GPM",
        "Power Consumption": "45W",
        "Dimensions": "12\" x 8\" x 4\""
      }
    },
    {
      id: 2,
      name: "OxiWater Home",
      price: 19.99,
      image: "https://via.placeholder.com/150",
      description: "Home water purification system for daily use",
      features: [
        "3-stage filtration",
        "Compact design",
        "Quick installation",
        "Filter change indicator"
      ],
      specifications: {
        "Filter Life": "6 months",
        "Flow Rate": "2.0 GPM",
        "Power Consumption": "30W",
        "Dimensions": "10\" x 6\" x 3\""
      }
    },
    {
      id: 3,
      name: "OxiWater Portable",
      price: 15.99,
      image: "https://via.placeholder.com/150",
      description: "Portable water purification bottle for on-the-go",
      features: [
        "Built-in filter",
        "BPA-free material",
        "500ml capacity",
        "One-click filter replacement"
      ],
      specifications: {
        "Filter Life": "3 months",
        "Capacity": "500ml",
        "Material": "BPA-free plastic",
        "Weight": "250g"
      }
    },
    {
      id: 4,
      name: "OxiWater Industrial",
      price: 49.99,
      image: "https://via.placeholder.com/150",
      description: "Industrial-grade water purification system",
      features: [
        "7-stage filtration",
        "High capacity",
        "Remote monitoring",
        "Auto-cleaning system"
      ],
      specifications: {
        "Filter Life": "24 months",
        "Flow Rate": "5.0 GPM",
        "Power Consumption": "100W",
        "Dimensions": "24\" x 16\" x 8\""
      }
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveSection('product-detail');
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckoutComplete = () => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      items: cart.map(item => ({
        name: item.name,
        quantity: 1,
        price: item.price
      })),
      total: parseFloat(getTotalPrice()),
      status: 'completed'
    };
    setTransactions([...transactions, newTransaction]);
    setCart([]);
    setActiveSection('transactions');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-section">
            <h2>OxiWater Dashboard</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Products</h3>
                <p>{products.length}</p>
              </div>
              <div className="stat-card">
                <h3>Cart Items</h3>
                <p>{cart.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Value</h3>
                <p>${getTotalPrice()}</p>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="products-section">
            <h2>Our Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price}</p>
                  <button 
                    className="add-to-cart-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            products={products}
            onAddToCart={addToCart}
          />
        ) : null;
      case 'cart':
        return (
          <div className="cart-section">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>${item.price}</p>
                      </div>
                      <button 
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: ${getTotalPrice()}</h3>
                  <button 
                    className="checkout-button"
                    onClick={() => setActiveSection('checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 'checkout':
        return (
          <Checkout
            cartItems={cart.map(item => ({ ...item, quantity: 1 }))}
            total={parseFloat(getTotalPrice())}
            onCheckoutComplete={handleCheckoutComplete}
          />
        );
      case 'transactions':
        return (
          <TransactionHistory transactions={transactions} />
        );
      case 'about':
        return (
          <div className="about-section">
            <h2>About OxiWater</h2>
            <div className="about-content">
              <p>OxiWater is a leading provider of water purification solutions, committed to delivering clean and safe water for homes and businesses worldwide.</p>
              <div className="company-values">
                <h3>Our Values</h3>
                <ul>
                  <li>Water Quality</li>
                  <li>Innovation</li>
                  <li>Sustainability</li>
                  <li>Customer Satisfaction</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-layout">
      <nav className="sidebar">
        <div className="company-logo">
          <h2>OxiWater</h2>
        </div>
        <ul className="nav-links">
          <li 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => {
              setActiveSection('dashboard');
              setSelectedProduct(null);
            }}
          >
            Dashboard
          </li>
          <li 
            className={activeSection === 'products' ? 'active' : ''} 
            onClick={() => {
              setActiveSection('products');
              setSelectedProduct(null);
            }}
          >
            Products
          </li>
          <li 
            className={activeSection === 'cart' ? 'active' : ''} 
            onClick={() => {
              setActiveSection('cart');
              setSelectedProduct(null);
            }}
          >
            Cart ({cart.length})
          </li>
          <li 
            className={activeSection === 'transactions' ? 'active' : ''} 
            onClick={() => {
              setActiveSection('transactions');
              setSelectedProduct(null);
            }}
          >
            Transactions
          </li>
          <li 
            className={activeSection === 'about' ? 'active' : ''} 
            onClick={() => {
              setActiveSection('about');
              setSelectedProduct(null);
            }}
          >
            About Us
          </li>
        </ul>
        <button 
          className="logout-button" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Home; 