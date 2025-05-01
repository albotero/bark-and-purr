import React from "react"
import Breadcrumb from "react-bootstrap/esm/Breadcrumb"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Tree = ({ items }) => {
  const { t } = useTranslation("routes")

  return (
    <Breadcrumb>
      {items.map(({ key, href, isActive }) => (
        <React.Fragment key={`tree_${key}`}>
          {isActive ? (
            <Breadcrumb.Item active>{t(key)}</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item linkProps={{ to: href }} linkAs={Link}>
              {t(key)}
            </Breadcrumb.Item>
          )}
        </React.Fragment>
      ))}
    </Breadcrumb>
  )
}

export default Tree
