import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CartContext } from '../context/cartContextObject';

const API_URL = 'https://api.thecatapi.com/v1/breeds?limit=100';

function getImageUrl(cat) {
  if (cat?.image?.url) return cat.image.url;
  return 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
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
        <Card className="shadow-sm">
          <Card.Img
            variant="top"
            src={getImageUrl(cat)}
            alt={cat.name}
            style={{ maxHeight: '420px', objectFit: 'cover' }}
          />
          <Card.Body>
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

            <div className="d-flex gap-2 mt-3">
              <Button variant="success" onClick={() => addToCart(cat)}>
                Lägg i kundvagn
              </Button>
              <Button as={Link} to="/cats" variant="outline-secondary">
                Tillbaka till katter
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
