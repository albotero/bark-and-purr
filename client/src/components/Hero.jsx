import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
import "../styles/Hero.css"
import { useTranslation } from "react-i18next"

const Hero = () => {
  const { t } = useTranslation("home")

  return (
    <section className="hero bg-primary text-white py-5">
      <Container>
        <Row className="text-center">
          <Col>
            <h1 className="display-4">{t("hero.title")}</h1>
            <p className="lead">{t("hero.subtitle")}</p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Hero
