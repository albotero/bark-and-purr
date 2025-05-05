import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation("home")

  return (
    <footer className="footer text-white py-3">
      <Container>
        <Row className="justify-content-center">
          <Col className="text-center">
            <p className="mb-0">© 2025 Bark & Purr. {t("rights_reserved")}.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
