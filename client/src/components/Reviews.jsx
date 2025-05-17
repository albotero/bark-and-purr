import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { HiTranslate } from "react-icons/hi"
import Button from "react-bootstrap/esm/Button"
import Col from "react-bootstrap/esm/Col"
import ProgressBar from "react-bootstrap/esm/ProgressBar"
import Row from "react-bootstrap/esm/Row"
import { useApi } from "../hooks/useApi"
import getLangName from "../utils/langName"
import ErrorMsg from "./ErrorMsg"
import Loading from "./Loading"

const Reviews = ({ reviews, setReviews }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { total_reviews: totalReviews, results: reviewsData, ratings, filters, product } = reviews
  const { t } = useTranslation("product")
  const [fetchData] = useApi()
  const filteredStars = filters.find(({ key }) => key === "rating")?.value

  const handleChangeFilter = async (stars) => {
    if (stars > 0) {
      setIsLoading(true)
      const fullUrl = product + `/reviews?rating=${stars}`
      const fetchedReviews = await fetchData({ fullUrl })
      setReviews(fetchedReviews)
      setIsLoading(false)
    }
  }

  return (
    <Row className="gap-3">
      {totalReviews === 0 ? (
        <ErrorMsg margin="2rem" width="10rem" />
      ) : (
        <>
          <Col md={4}>
            <h4>{t("reviews.filter")}</h4>
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
                    <React.Fragment key={`star_${stars}`}>
                      <Button
                        variant="link"
                        className="text-start p-0"
                        disabled={isSelected}
                        onClick={() => handleChangeFilter(stars)}
                      >
                        {`${stars} ${t(stars == 1 ? t("reviews.star") : t("reviews.stars"))}`}
                      </Button>
                      <ProgressBar now={now} variant={isSelected ? "warning" : "primary"} />
                      <p className={"m-0 text-" + (isSelected ? "warning" : "primary")}> {`${now}%`}</p>
                    </React.Fragment>
                  )
                })}
            </div>
          </Col>

          <Col>
            <h4>{t("reviews.reviews")}</h4>
            {isLoading ? (
              <Loading margin="1rem" width="7.5rem" />
            ) : reviewsData.length === 0 ? (
              <ErrorMsg margin="1rem" width="7.5rem" />
            ) : (
              reviewsData.map(
                ({ id: reviewId, user, date, rating: reviewRating, body, translated, sourceLang, targetLang }) => (
                  <div key={`review_${reviewId}`} className="mb-3 border-bottom pb-2">
                    <strong>{user}</strong> <span className="text-warning">{"★".repeat(reviewRating)}</span>
                    <div className="text-muted small">{new Date(date).toLocaleString()}</div>
                    <p className="m-0">{body}</p>
                    {translated && (
                      <div className="text-muted small fst-italic d-flex gap-1 align-items-center">
                        <HiTranslate />
                        {t("automatically_translated", { sourceLang: getLangName(sourceLang, targetLang) })}
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </Col>
        </>
      )}
    </Row>
  )
}

export default Reviews
