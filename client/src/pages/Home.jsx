import Hero from "../components/Hero"
import FeaturedProducts from "../components/FeaturedProducts"
import Container from "react-bootstrap/esm/Container"

const Home = () => {
  return (
    <>
      <Hero /> 
      <Container className="section-padding">
        <FeaturedProducts />
      </Container>
    </>
  )
}

export default Home
