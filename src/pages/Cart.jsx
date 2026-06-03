import { useContext } from 'react';
import { Alert, Button, Card, Container, ListGroup } from 'react-bootstrap';
import { CartContext } from '../context/cartContextObject';

function getImageUrl(cat) {
  if (cat?.image?.url) return cat.image.url;
  return 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
}

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext);

  return (
    <Container className="py-5">
      <h2>Kundvagn</h2>

      {cart.length === 0 && (
        <Alert variant="info" className="mt-3">
          Kundvagnen är tom.
        </Alert>
      )}

      {cart.length > 0 && (
        <>
          <ListGroup className="mt-3">
            {cart.map((cat, index) => (
              <ListGroup.Item key={`${cat.id}-${index}`}>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={getImageUrl(cat)}
                    alt={cat.name}
                    width="90"
                    height="90"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Card.Body className="p-0">
                    <Card.Title className="mb-1">{cat.name}</Card.Title>
                    <Card.Text className="mb-0">
                      <strong>Ursprung:</strong> {cat.origin}
                    </Card.Text>
                  </Card.Body>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button variant="danger" className="mt-3" onClick={clearCart}>
            Töm kundvagn
          </Button>
        </>
      )}
    </Container>
  );
}
