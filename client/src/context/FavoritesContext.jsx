import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import Swal from "sweetalert2";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fetchData] = useApi();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // Obtener favoritos del backend
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Usuario no autenticado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const response = await fetchData({
      endpoint: "favorites/user",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response?.error) {
      setError(response.error);
      setFavorites([]);
    } else {
      setFavorites(response || []);
      setError(null);
    }
    setIsLoading(false);
  }, [fetchData, token, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Toggle favorito (agregar o eliminar)
  const toggleFavorite = async (product) => {
  const currentToken = localStorage.getItem("token");
  const isAuthenticated = !!currentToken;

  if (!isAuthenticated) {
    Swal.fire({
      icon: "warning",
      title: "Debe iniciar sesión",
      text: "Para agregar productos a favoritos, inicia sesión primero.",
    });
    return null;
  }

  const existingFavorite = favorites.find(
    (fav) => fav.id === product.id || fav.product_id === product.id
  );

  if (existingFavorite) {
    // Eliminar favorito
    const response = await fetchData({
      endpoint: `favorites/${existingFavorite.favorite_id || existingFavorite.id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    if (!response?.error) {
      setFavorites((prev) =>
        prev.filter(
          (item) =>
            (item.favorite_id || item.id) !==
            (existingFavorite.favorite_id || existingFavorite.id)
        )
      );
      return "removed";
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: response.error || "Intenta de nuevo",
      });
      return null;
    }
  } else {
    // Agregar favorito
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
        title: "Error al agregar",
        text: response.error || "Intenta de nuevo",
      });
      return null;
    }
  }
};

  const removeFromFavorites = async (favoriteId) => {
    const currentToken = localStorage.getItem("token");

    const response = await fetchData({
      endpoint: `favorites/${favoriteId}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    if (!response?.error) {
      setFavorites((prev) =>
        prev.filter((item) => (item.favorite_id || item.id) !== favoriteId)
      );
      Swal.fire({
        icon: "success",
        title: "Producto eliminado de favoritos",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: response.error || "Intenta de nuevo",
      });
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        setFavorites,
        isLoading,
        error,
        removeFromFavorites,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
