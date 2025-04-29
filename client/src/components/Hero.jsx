import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"

const Hero = () => {
  return (
    <section className="hero bg-primary text-white py-5">
      <Container>
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Special offers for your best friend</h1>
            <p className="lead">Discover the best products for your pets</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default Hero;
