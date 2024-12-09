import React, { useState, useEffect } from 'react';
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { fetchCart, fetchProductDetails } from './ApiService';
import { USER_ID } from './constants';

function Checkout() {
  const [cart, setCart] = useState({ products: [] });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getCart = async () => {
      try {
        const data = await fetchCart(USER_ID);

        const orders = Array.isArray(data) ? data : [];
        const latestOrder = orders[orders.length - 1] || { products: [] };

        const productsWithDetails = await Promise.all(
          latestOrder.products.map(async (item) => {
            try {
              const productDetails = await fetchProductDetails(item.productId);
              return { ...productDetails, quantity: item.quantity };
            } catch (error) {
              console.error(`Error fetching details for productId ${item.productId}:`, error);
              return { id: item.productId, quantity: item.quantity }; // Fallback
            }
          })
        );

        setCart({ ...latestOrder, products: productsWithDetails });
        const total = productsWithDetails.reduce(
          (acc, item) => acc + (item?.price || 0) * item.quantity,
          0
        );
        setTotal(total);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    getCart();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Checkout</h2>
      {cart.products.length > 0 ? (
        <div>
          <h3>Order Details</h3>
          <p>Date: {new Date(cart.date || Date.now()).toLocaleDateString()}</p>
          <Row>
            <Col md={8}>
              <ListGroup>
                {cart.products.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h5>{item.title}</h5>
                        <p>${item.price} x {item.quantity}</p>
                        <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center">Summary</Card.Title>
                  <hr />
                  <h5>Grand Total: ${total.toFixed(2)}</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </Container>
  );
}

export default Checkout;