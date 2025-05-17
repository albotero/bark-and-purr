import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useFavorites } from "../context/FavoritesContext"
import { useUser } from "../context/UserContext"

const FavHeart = ({ product, inline }) => {
  // Estado local para manejar si está en favoritos
  const { isAuthenticated } = useUser()
  const { toggleFavorite, isProductFavorite } = useFavorites()
  const navigate = useNavigate()
  const isFavorite = isProductFavorite(product.id)

  const handleHeartClick = async (e) => {
    e.stopPropagation()
    const result = await toggleFavorite(product)

    if (result === "added") {
      Swal.fire({
        icon: "success",
        title: "Producto agregado a favoritos",
        showCloseButton: true,
        confirmButtonText: "Ver favoritos",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/user/favorites")
        }
      })
    } else if (result === "removed") {
      Swal.fire({
        icon: "info",
        title: "Producto eliminado de favoritos",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  /* Mostrar el corazón solo si el usuario está autenticado */
  return (
    isAuthenticated && (
      <button
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={handleHeartClick}
        className={"favorite-heart-btn" + (inline ? " position-static" : "") + (isFavorite ? " favorited" : "")}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
    )
  )
}

export default FavHeart
