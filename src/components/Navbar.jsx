import React, { useContext } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function AppNavbar() {
  const { cartCount } = useContext(CartContext);
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">Kattbutik</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Hem</Nav.Link>
            <Nav.Link as={Link} to="/cats">Katter</Nav.Link>
            <Nav.Link as={Link} to="/owner">Om Ägaren</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Kundvagn{' '}
              <Badge bg="info">{cartCount}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
