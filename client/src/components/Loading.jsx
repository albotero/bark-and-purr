import { useTranslation } from "react-i18next"
import angryCat from "../assets/angry-cat.svg"
import Container from "react-bootstrap/esm/Container"
import Col from "react-bootstrap/esm/Col"
import Row from "react-bootstrap/esm/Row"

const Loading = () => {
  const { t } = useTranslation("discover")

  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center">
          <img src={angryCat} style={{ margin: "5rem 0 2rem", width: "15rem" }} />
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <p className="fs-4">{t("loading")}...</p>
        </Col>
      </Row>
    </Container>
  )
}

export default Loading
