import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useApi } from "../hooks/useApi";
import Swal from "sweetalert2";

const FavoritesContext = createContext();

const getFavoriteId = (item) => item.favorite_id || item.id;

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fetchData] = useApi();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // Obtener favoritos del backend con manejo de errores
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Usuario no autenticado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchData({
        endpoint: "favorites/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response || response.error) {
        setError(response?.error || "Unknown error fetching favorites");
        setFavorites([]);
      } else {
        setFavorites(response || []);
        setError(null);
      }
    } catch (error) {
      setError(error.message || "Unexpected error fetching favorites");
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, token, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Toggle favorito (add or remove) con manejo de errores
  const toggleFavorite = useCallback(async (product) => {
    const currentToken = localStorage.getItem("token");
    const isAuthenticated = !!currentToken;

    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "You must log in",
        text: "To add products to favorites, please log in first.",
      });
      return null;
    }

    try {
      const existingFavorite = favorites.find(
        (fav) => getFavoriteId(fav) === product.id || fav.product_id === product.id
      );

      if (existingFavorite) {
        // Remove favorite
        const response = await fetchData({
          endpoint: `favorites/${getFavoriteId(existingFavorite)}`,
          method: "DELETE",
          headers: { Authorization: `Bearer ${currentToken}` },
        });

        if (!response?.error) {
          setFavorites((prev) =>
            prev.filter((item) => getFavoriteId(item) !== getFavoriteId(existingFavorite))
          );
          return "removed";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error removing favorite",
            text: response.error || "Please try again",
          });
          return null;
        }
      } else {
        // Add favorite
        const response = await fetchData({
          endpoint: "favorites",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });

        if (!response?.error) {
          const newFavorite = {
            ...product,
            favorite_id: response.id || response.favorite_id || response.id,
          };
          setFavorites((prev) => [...prev, newFavorite]);
          return "added";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error adding favorite",
            text: response.error || "Please try again",
          });
          return null;
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected error",
        text: error.message || "Please try again",
      });
      return null;
    }
  }, [fetchData, favorites]);

  // Eliminar favorito con manejo de errores
  const removeFromFavorites = useCallback(async (favoriteId) => {
    const currentToken = localStorage.getItem("token");

    try {
      const response = await fetchData({
        endpoint: `favorites/${favoriteId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response?.error) {
        setFavorites((prev) =>
          prev.filter((item) => getFavoriteId(item) !== favoriteId)
        );
        Swal.fire({
          icon: "success",
          title: "Product removed from favorites",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error removing product",
          text: response.error || "Please try again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected error",
        text: error.message || "Please try again",
      });
    }
  }, [fetchData]);

  const contextValue = useMemo(() => ({
    favorites,
    setFavorites,
    isLoading,
    error,
    removeFromFavorites,
    toggleFavorite,
  }), [favorites, isLoading, error, removeFromFavorites, toggleFavorite]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
