import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CartContext } from '../context/cartContextObject';

const API_URL = 'https://api.thecatapi.com/v1/breeds?limit=100';
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

export default function CatDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const [cat, setCat] = useState(state?.cat ?? null);
  const [loading, setLoading] = useState(!state?.cat);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (state?.cat?.id === id) return;

    const controller = new AbortController();

    async function loadCat() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Kunde inte hämta kattdata.');
        }

        const data = await response.json();
        const found = data.find((item) => item.id === id);

        if (!found) {
          setError('Katten kunde inte hittas.');
          return;
        }

        setCat(found);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Något gick fel vid hämtning av kattdetaljer.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCat();
    return () => controller.abort();
  }, [id, state?.cat]);

  return (
    <Container className="py-5">
      <h2>Kattdetaljer</h2>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Laddar kattdetaljer...</p>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && cat && (
        <Row className="gy-4">
          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={getImageUrl(cat)}
                alt={cat.name}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">{cat.name}</Card.Title>
                <Card.Text>
                  <strong>Ursprung:</strong> {cat.origin}
                </Card.Text>
                <Card.Text>
                  <strong>Temperament:</strong> {cat.temperament}
                </Card.Text>
                <Card.Text>
                  <strong>Beskrivning:</strong> {cat.description}
                </Card.Text>

                <div className="d-grid gap-2 mt-auto">
                  <Button variant="success" onClick={() => addToCart(cat)}>
                    Lägg i kundvagn
                  </Button>
                  <Button as={Link} to="/cats" variant="outline-secondary">
                    Tillbaka till katter
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
