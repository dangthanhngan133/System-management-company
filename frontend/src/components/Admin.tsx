import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'available' | 'out_of_stock';
}

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', status: 'active' },
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'OxiWater Premium', price: 29.99, stock: 100, status: 'available' },
    { id: 2, name: 'OxiWater Home', price: 19.99, stock: 50, status: 'available' },
  ]);

  // New state for forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    status: 'available'
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleAddUser = () => {
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({
      username: '',
      email: '',
      role: 'user',
      status: 'active'
    });
    setShowUserForm(false);
  };

  const handleAddProduct = () => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts([...products, { ...newProduct, id: newId }]);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      status: 'available'
    });
    setShowProductForm(false);
  };

  const renderUserForm = () => (
    <div className="form-overlay">
      <div className="form-container">
        <h3>Add New User</h3>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-buttons">
          <button className="submit-btn" onClick={handleAddUser}>Add User</button>
          <button className="cancel-btn" onClick={() => setShowUserForm(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderProductForm = () => (
    <div className="form-overlay">
      <div className="form-container">
        <h3>Add New Product</h3>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={newProduct.status}
            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'available' | 'out_of_stock' })}
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="form-buttons">
          <button className="submit-btn" onClick={handleAddProduct}>Add Product</button>
          <button className="cancel-btn" onClick={() => setShowProductForm(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{users.filter(user => user.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Available Products</h3>
          <p>{products.filter(product => product.status === 'available').length}</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="add-btn" onClick={() => setShowUserForm(true)}>
          Add New User
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUserForm && renderUserForm()}
    </div>
  );

  const renderProductManagement = () => (
    <div className="product-management">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="add-btn" onClick={() => setShowProductForm(true)}>
          Add New Product
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && renderProductForm()}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUserManagement();
      case 'products':
        return renderProductManagement();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <ul className="admin-nav-links">
          <li 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={activeSection === 'users' ? 'active' : ''} 
            onClick={() => setActiveSection('users')}
          >
            User Management
          </li>
          <li 
            className={activeSection === 'products' ? 'active' : ''} 
            onClick={() => setActiveSection('products')}
          >
            Product Management
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <main className="admin-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin; 