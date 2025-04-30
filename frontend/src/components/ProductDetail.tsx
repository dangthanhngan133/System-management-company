import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

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

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-specifications">
            <h3>Specifications</h3>
            <table>
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            className="add-to-cart-button"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 