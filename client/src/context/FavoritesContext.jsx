import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useApi } from "../hooks/useApi";
import Swal from "sweetalert2";

const FavoritesContext = createContext();

const getFavoriteId = (item) => item.favorite_id; 

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fetchData] = useApi();

  const getToken = () => localStorage.getItem("token");
  const isAuthenticated = !!getToken();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Usuario no autenticado");
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchData({
        endpoint: "favorites",
        method: "GET",
        token: getToken(),
      });

      if (response.error) {
        setError(response.error || "Error desconocido al obtener favoritos");
        setFavorites([]);
      } else {
        setFavorites(Array.isArray(response) ? response : []);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Error inesperado al obtener favoritos");
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (product, e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      console.trace("toggleFavorite llamado");
      if (isDeleting) {
        console.log("Cancelado porque ya se está eliminando un favorito.");
        return null;
      }

      const currentToken = getToken();

      setIsDeleting(true);

      try {
        // Buscar favorito existente por product_id para evitar duplicados
        const existingFavorite = favorites.find(
          (fav) => fav.product_id === product.id
        );

        if (existingFavorite) {
          // Eliminar favorito usando favorite_id
          const favoriteId = getFavoriteId(existingFavorite);
          if (!favoriteId) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se encontró el ID del favorito para eliminar.",
            });
            setIsDeleting(false);
            return null;
          }

          const response = await fetchData({
            endpoint: `favorites/${favoriteId}`, 
            method: "DELETE",
            token: currentToken,
          });

          if (!response.error) {
            setFavorites((prev) =>
              prev.filter((item) => getFavoriteId(item) !== favoriteId)
            );
            return "removed";
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al eliminar favorito",
              text: response.error || "Intenta nuevamente",
            });
            return null;
          }
        } else {
          // Agregar favorito (POST)
          const response = await fetchData({
            endpoint: "favorites",
            method: "POST",
            token: currentToken,
            body: { product_id: product.id },
          });

          if (!response.error) {
            // Obtener favorite_id del backend 
            const favoriteId = response.favorite_id || response.id;
            if (!favoriteId) {
              Swal.fire({
                icon: "error",
                title: "Error al agregar favorito",
                text: "No se recibió el ID del favorito desde el servidor.",
              });
              return null;
            }

            const newFavorite = {
              ...product,
              favorite_id: favoriteId,
              product_id: product.id,
            };

            setFavorites((prev) => [...prev, newFavorite]);
            return "added";
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al agregar favorito",
              text: response.error || "Intenta nuevamente",
            });
            return null;
          }
        }
      } catch (error) {
        console.error("Error inesperado en toggleFavorite:", error);
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: error.message || "Intenta nuevamente",
        });
        return null;
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchData, favorites, isDeleting]
  );

  const removeFromFavorites = useCallback(
    async (favoriteId, e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      const idNum = Number(favoriteId);
      if (isNaN(idNum)) {
        Swal.fire({
          icon: "error",
          title: "ID inválido",
          text: "El ID del favorito no es válido",
        });
        return;
      }

      console.log("removeFromFavorites llamado con favoriteId:", favoriteId);

      if (isDeleting) {
        console.log(
          "Ya hay una eliminación en curso, ignorando llamada repetida."
        );
        return;
      }

      setIsDeleting(true);

      try {
        const token = getToken();
        console.log("Token para eliminar favorito:", token);

        const response = await fetchData({
          endpoint: `favorites/${idNum}`,
          method: "DELETE",
          token,
        });

        console.log("Respuesta del DELETE:", response);

        if (!response.error) {
          setFavorites((prev) =>
            prev.filter((item) => getFavoriteId(item) !== idNum)
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
            title: "Error al eliminar producto",
            text: response.error || "Intenta nuevamente",
          });
        }
      } catch (error) {
        console.error("Error inesperado en removeFromFavorites:", error);
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: error.message || "Intenta nuevamente",
        });
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchData, isDeleting]
  );

  const contextValue = useMemo(
    () => ({
      favorites,
      setFavorites,
      isLoading,
      error,
      removeFromFavorites,
      toggleFavorite,
    }),
    [favorites, isLoading, error, removeFromFavorites, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
