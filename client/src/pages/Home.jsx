import Hero from "../components/Hero"
import FeaturedProducts from "../components/FeaturedProducts"
import Container from "react-bootstrap/esm/Container"

const Home = () => {
  return (
    <Container className="section-padding">
      <Hero />
      <FeaturedProducts />
    </Container>
  )
}

export default Home
