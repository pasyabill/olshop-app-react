import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { fetchProductDetails, addToCart } from './ApiService';
import { USER_ID } from './constants';

function Detail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductDetails(id); // Fetch product using the service
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    getProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(USER_ID, [{ productId: product.id, quantity }]);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '24rem' }}>
        <Card.Img
          variant="top"
          src={product.image || 'https://via.placeholder.com/150'} // Placeholder jika tidak ada gambar
          alt={product.name}
        />
        <Card.Body>
          <Card.Title>{product.name || 'Loading...'}</Card.Title>
          <Card.Text>{product.description || 'No description available.'}</Card.Text>
          <Card.Text>
            <strong>Price:</strong> ${product.price || 0}
          </Card.Text>
          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleAddToCart}
            disabled={!product.id}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Detail;