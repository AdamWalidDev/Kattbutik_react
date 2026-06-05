import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Spinner,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContextObject';

const API_URL = 'https://api.thecatapi.com/v1/breeds?limit=30';
const CATS_PER_PAGE = 10;
const FALLBACK_IMAGES = [
  'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
  'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
  'https://cdn2.thecatapi.com/images/bpc.jpg',
  'https://cdn2.thecatapi.com/images/6R8Y8fEwz.jpg',
  'https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg',
];

function getImageUrl(cat) {
  if (cat.image?.url) return cat.image.url;

  const idText = String(cat?.id ?? '0');
  const hash = idText.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

async function getImageUrlFromReferenceId(referenceImageId, signal) {
  if (!referenceImageId) return null;

  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/${referenceImageId}`, {
      signal,
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.url ?? null;
  } catch {
    return null;
  }
}

export default function Cats() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useContext(CartContext);

  const filteredCats = cats.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCats.length / CATS_PER_PAGE);
  const pageStart = (currentPage - 1) * CATS_PER_PAGE;
  const pageCats = filteredCats.slice(pageStart, pageStart + CATS_PER_PAGE);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  function goToPage(page) {
    setCurrentPage(page);
  }

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

        const catsWithImages = await Promise.all(
          data.map(async (cat) => {
            if (cat.image?.url || !cat.reference_image_id) {
              return cat;
            }

            const resolvedImageUrl = await getImageUrlFromReferenceId(
              cat.reference_image_id,
              controller.signal
            );

            if (!resolvedImageUrl) {
              return cat;
            }

            return {
              ...cat,
              image: {
                ...(cat.image ?? {}),
                url: resolvedImageUrl,
              },
            };
          })
        );

        setCats(catsWithImages);
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

      <Form.Group className="mt-3" controlId="cat-search">
        <Form.Label>Sok katt pa namn</Form.Label>
        <Form.Control
          type="text"
          placeholder="Skriv t.ex. Ben"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Laddar katter...</p>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filteredCats.length === 0 && (
        <Alert variant="warning">Inga katter hittades.</Alert>
      )}

      {!loading && !error && filteredCats.length > 0 && (
        <>
          <Row className="g-4 mt-1">
            {pageCats.map((cat) => (
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

          {totalPages > 1 && (
            <Pagination className="mt-4 justify-content-center flex-wrap">
              <Pagination.Prev
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}
