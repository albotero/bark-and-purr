import { useTranslation } from "react-i18next"
import Container from "react-bootstrap/esm/Container"
import Col from "react-bootstrap/esm/Col"
import Row from "react-bootstrap/esm/Row"
import sadDog from "../assets/sad-dog.svg"
import backCat from "../assets/back-cat.svg"

const ErrorMsg = ({ error }) => {
  const { t } = useTranslation("errors")
  const errorNumber = error?.match(/fetch\.(\d+)/) || []

  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center">
          <img src={error ? sadDog : backCat} className="message-img" />
        </Col>
      </Row>
      {error ? (
        <Row>
          <Col xs={12} md={5}>
            <div className="display-3 text-center text-md-end fw-normal">{errorNumber[1]}</div>
          </Col>
          <Col className="text-center text-md-start">
            <p className="h2 my fs-1">{t("title")}</p>
            <p className="fs-4">{t(error)}</p>
          </Col>
        </Row>
      ) : (
        <Row>
          {/* No products found */}
          <Col className="text-center">
            <p className="fs-4">{t("nothing_here")}</p>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default ErrorMsg
