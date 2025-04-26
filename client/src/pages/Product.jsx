import { useParams } from "react-router"

const Product = () => {
  const { productId } = useParams()
  return <div>Product: {productId}</div>
}

export default Product
