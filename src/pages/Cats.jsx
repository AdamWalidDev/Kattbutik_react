import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContextObject';

const API_URL = 'https://api.thecatapi.com/v1/breeds?limit=30';
function getImageUrl(cat) {
  if (cat.image?.url) return cat.image.url;
  return 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
}

export default function Cats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCats() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Kunde inte hämta kattdata från API.');
        }

        const data = await response.json();
        setCats(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Något gick fel vid hämtning av katter. Försök igen.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCats();
    return () => controller.abort();
  }, []);

  return (
    <Container className="py-5">
      <h2>Katter</h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Laddar katter...</p>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && cats.length === 0 && (
        <Alert variant="warning">Inga katter hittades.</Alert>
      )}

      {!loading && !error && cats.length > 0 && (
        <Row className="g-4 mt-1">
          {cats.map((cat) => (
            <Col key={cat.id} sm={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={getImageUrl(cat)}
                  alt={cat.name}
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{cat.name}</Card.Title>
                  <Card.Text>
                    <strong>Ursprung:</strong> {cat.origin}
                  </Card.Text>
                  <div className="d-flex gap-2 mt-3">
                    <Button
                      as={Link}
                      to={`/cats/${cat.id}`}
                      state={{ cat }}
                      variant="outline-primary"
                    >
                      Visa detaljer
                    </Button>
                    <Button variant="success" onClick={() => addToCart(cat)}>
                      Lägg i kundvagn
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
