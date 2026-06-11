import { useContext, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { CartContext } from '../context/cartContextObject';

const FALLBACK_IMAGES = [
  'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
  'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
  'https://cdn2.thecatapi.com/images/bpc.jpg',
  'https://cdn2.thecatapi.com/images/6R8Y8fEwz.jpg',
  'https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg',
];

function getImageUrl(cat) {
  if (cat?.image?.url) return cat.image.url;

  const idText = String(cat?.id ?? '0');
  const hash = idText.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderAlert, setShowOrderAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  function openCheckout() {
    setShowCheckout(true);
  }

  function closeCheckout() {
    setShowCheckout(false);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function submitOrder(event) {
    event.preventDefault();
    setShowCheckout(false);
    setShowOrderAlert(true);
    clearCart();
    setFormData({ name: '', email: '', address: '' });
  }

  return (
    <Container className="py-5">
      <h2>Kundvagn</h2>

      {showOrderAlert && (
        <Alert
          variant="success"
          className="mt-3"
          dismissible
          onClose={() => setShowOrderAlert(false)}
        >
          Tack! Din order ar skickad.
        </Alert>
      )}

      {cart.length === 0 && (
        <Alert variant="info" className="mt-3">
          Kundvagnen är tom.
        </Alert>
      )}

      {cart.length > 0 && (
        <>
          <Row className="g-3 mt-3">
            {cart.map((cat, index) => (
              <Col key={`${cat.id}-${index}`} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={getImageUrl(cat)}
                    alt={cat.name}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{cat.name}</Card.Title>
                    <Card.Text>
                      <strong>Ursprung:</strong> {cat.origin}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-grid gap-2 mt-4 d-md-flex justify-content-md-start">
            <Button variant="danger" onClick={clearCart}>
              Töm kundvagn
            </Button>
            <Button variant="primary" onClick={openCheckout}>
              Till kassan
            </Button>
          </div>
        </>
      )}

      <Modal show={showCheckout} onHide={closeCheckout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Slutfor bestallning</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitOrder}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="checkout-name">
              <Form.Label>Namn</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="checkout-email">
              <Form.Label>E-post</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="checkout-address">
              <Form.Label>Leveransadress</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleFieldChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeCheckout}>
              Avbryt
            </Button>
            <Button variant="success" type="submit">
              Skicka order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
