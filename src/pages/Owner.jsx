import React from 'react';
import { Container } from 'react-bootstrap';

export default function Owner() {
  return (
    <Container className="py-5">
      <h2>Om Ägaren</h2>
      <p>Namn: Ditt Namn</p>
      <p>Email: din@email.se</p>
      <p>Telefon: 070-123 45 67</p>
    </Container>
  );
}
