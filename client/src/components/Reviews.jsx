import { useTranslation } from "react-i18next"
import Button from "react-bootstrap/esm/Button"
import Col from "react-bootstrap/esm/Col"
import ProgressBar from "react-bootstrap/esm/ProgressBar"
import Row from "react-bootstrap/esm/Row"
import { useApi } from "../hooks/useApi"
import ErrorMsg from "./ErrorMsg"

const Reviews = ({ reviews, setReviews }) => {
  const { total_reviews: totalReviews, results: reviewsData, ratings, filters, product } = reviews
  const { t } = useTranslation()
  const [fetchData] = useApi()
  const filteredStars = filters.find(({ key }) => key === "rating")?.value

  const handleChangeFilter = async (stars) => {
    if (stars > 0) {
      const fetchedReviews = await fetchData({ fullUrl: product + `/reviews?rating=${stars}` })
      setReviews(fetchedReviews)
    }
  }

  return (
    <Row className="gap-3">
      <Col md={4}>
        <h4>Filter</h4>
        <div
          className="d-grid align-items-center"
          style={{ gridTemplateColumns: "max-content 1fr max-content", gap: ".25rem .4rem" }}
        >
          {Array(5)
            .fill()
            .map((_, i) => {
              const stars = 5 - i
              const countByStar = ratings.reduce((acc, el) => acc + (el.rating == stars ? el.count : 0), 0)
              const now = Math.round((countByStar / totalReviews) * 1000) / 10
              const isSelected = stars == filteredStars
              return (
                <>
                  <Button
                    variant="link"
                    className="text-start p-0"
                    disabled={isSelected}
                    onClick={() => handleChangeFilter(stars)}
                  >
                    {`${stars} ${t(stars == 1 ? "star" : "stars")}`}
                  </Button>
                  <ProgressBar now={now} variant={isSelected ? "warning" : "primary"} />
                  <p className={"m-0 text-" + (isSelected ? "warning" : "primary")}> {`${now}%`}</p>
                </>
              )
            })}
        </div>
      </Col>

      <Col>
        <h4>Reviews</h4>
        {reviewsData.map(({ id: reviewId, user, date, rating: reviewRating, body }) => (
          <div key={`review_${reviewId}`} className="mb-3 border-bottom pb-2">
            <strong>{user}</strong> <span className="text-warning">{"★".repeat(reviewRating)}</span>
            <div className="text-muted small">{new Date(date).toLocaleString()}</div>
            <p className="mb-1">{body}</p>
          </div>
        ))}
        {reviewsData.length === 0 && <ErrorMsg margin="1rem" width="7.5rem" />}
      </Col>
    </Row>
  )
}

export default Reviews
