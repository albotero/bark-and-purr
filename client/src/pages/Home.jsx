import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Container from "react-bootstrap/esm/Container"

const Home = () => {
  return (
    <Container className="my-4">
      <Hero />
      <FeaturedProducts />
    </Container>
  );
};

export default Home;
