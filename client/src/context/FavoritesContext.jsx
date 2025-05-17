import { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { useApi } from "../hooks/useApi"
import { useUser } from "./UserContext"

const FavoritesContext = createContext()

const getFavoriteId = (item) => item.favorite_id

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fetchData] = useApi()
  const { getToken, isAuthenticated } = useUser()
  const { i18n } = useTranslation()

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setError("Usuario no autenticado")
        setFavorites([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchData({
          endpoint: `favorites/${i18n.language}`,
          method: "GET",
          token: getToken(),
        })

        if (response.error) {
          setError(response.error || "Error desconocido al obtener favoritos")
          setFavorites([])
        } else {
          setFavorites(response.favorites || [])
          setError(null)
        }
      } catch (err) {
        setError(err.message || "Error inesperado al obtener favoritos")
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchFavorites()
  }, [fetchData, getToken, isAuthenticated, i18n.language])

  const toggleFavorite = async (product) => {
    if (isDeleting) {
      console.log("Cancelado porque ya se está eliminando un favorito.")
      return null
    }

    const currentToken = getToken()

    setIsDeleting(true)

    try {
      // Buscar favorito existente por product_id para evitar duplicados
      const existingFavorite = favorites.find((fav) => fav.product_id === product.id)

      if (existingFavorite) {
        // Eliminar favorito usando favorite_id
        const favoriteId = getFavoriteId(existingFavorite)
        if (!favoriteId) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró el ID del favorito para eliminar.",
          })
          setIsDeleting(false)
          return null
        }

        const response = await fetchData({
          endpoint: `favorites/${favoriteId}`,
          method: "DELETE",
          token: currentToken,
        })

        if (!response.error) {
          setFavorites((prev) => prev.filter((item) => getFavoriteId(item) !== favoriteId))
          return "removed"
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar favorito",
            text: response.error || "Intenta nuevamente",
          })
          return null
        }
      } else {
        // Agregar favorito (POST)
        const response = await fetchData({
          endpoint: "favorites",
          method: "POST",
          token: currentToken,
          body: { product_id: product.id },
        })

        if (!response.error) {
          // Obtener favorite_id del backend
          const favoriteId = response.favorite_id || response.id
          if (!favoriteId) {
            Swal.fire({
              icon: "error",
              title: "Error al agregar favorito",
              text: "No se recibió el ID del favorito desde el servidor.",
            })
            return null
          }

          const newFavorite = {
            ...product,
            favorite_id: favoriteId,
            product_id: product.id,
          }

          setFavorites((prev) => [...prev, newFavorite])
          return "added"
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al agregar favorito",
            text: response.error || "Intenta nuevamente",
          })
          return null
        }
      }
    } catch (error) {
      console.error("Error inesperado en toggleFavorite:", error)
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: error.message || "Intenta nuevamente",
      })
      return null
    } finally {
      setIsDeleting(false)
    }
  }

  const isProductFavorite = (productId) => !!favorites?.find((fav) => fav.product_id === productId)

  const context = {
    favorites,
    setFavorites,
    isProductFavorite,
    isLoading,
    error,
    toggleFavorite,
  }

  return <FavoritesContext.Provider value={context}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => useContext(FavoritesContext)
