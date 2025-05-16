import { useState, useEffect } from "react";
import "../styles/ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import { BsCart4, BsTrash } from "react-icons/bs";
import { IoArrowRedo } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import Swal from "sweetalert2";

export function ProductCard({ product, showAddToCart = true }) {
  const { id: productId, title, price, thumbnail, rating } = product;
  const { addToCart, removeFromCart, decreaseQuantity, cart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const cartItem = cart.find((item) => item.id === productId);
  const isProductInCart = !!cartItem;

  const [isFavorite, setIsFavorite] = useState(false);

  // Nuevo estado para saber si el usuario está logueado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al montar el componente, verificamos si hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Actualizar estado si el producto está en favoritos
  useEffect(() => {
    if (Array.isArray(favorites)) {
      const fav = favorites.find(
        (favItem) => favItem.id === productId || favItem.product_id === productId
      );
      setIsFavorite(!!fav);
    } else {
      setIsFavorite(false);
    }
  }, [favorites, productId]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const result = await toggleFavorite(product);

    if (result === "added") {
      Swal.fire({
        icon: "success",
        title: "Producto agregado a favoritos",
        showConfirmButton: true,
        confirmButtonText: "Ver favoritos",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/user/favorites");
        }
      });
    } else if (result === "removed") {
      Swal.fire({
        icon: "info",
        title: "Producto eliminado de favoritos",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return isProductInCart ? (
    <Card className="mb-3 shadow-sm position-relative">
      {/* Mostrar el corazón solo si el usuario está autenticado */}
      {isAuthenticated && (
        <button
          aria-label="Agregar a favoritos"
          onClick={handleFavoriteClick}
          className="favorite-heart-btn"
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            fontSize: "24px",
            color: isFavorite ? "red" : "gray",
          }}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      <Card.Body className="d-flex align-items-center">
        <div
          className="me-3"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#d3d3d3",
          }}
        >
          {thumbnail}
        </div>
        <div className="flex-grow-1">
          <h5>{title}</h5>
          <small>Unitary Price: ${price.toLocaleString()}</small>
          <div className="mt-2 d-flex align-items-center gap-2">
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => decreaseQuantity(productId)}
              >
                -
              </Button>
              <Button variant="light" disabled>
                {cartItem.quantity}
              </Button>
              <Button
                variant="secondary"
                onClick={() => addToCart({ ...product, quantity: 1 })}
              >
                +
              </Button>
            </ButtonGroup>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeFromCart(productId)}
              title="Remove from cart"
            >
              <BsTrash />
            </Button>
          </div>
        </div>
        <div className="text-end">
          <h6>Total: ${(price * cartItem.quantity).toLocaleString()}</h6>
        </div>
      </Card.Body>
    </Card>
  ) : (
    <Card className="position-relative">
      {/* Mostrar el corazón solo si el usuario está autenticado */}
      {isAuthenticated && (
        <button
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={handleFavoriteClick}
          className={`favorite-heart-btn ${isFavorite ? "favorited" : ""}`}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      <div className="position-relative">
        <Card.Img
          variant="top"
          src={thumbnail || "/placeholder.png"}
          className={
            "ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")
          }
        />
        {rating && (
          <div className="product-rating">
            <TiStarFullOutline className="star" /> {Number(rating).toFixed(1)}
          </div>
        )}
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex gap-3 w-100">
          <Card.Text className="flex-grow-1 m-0">
            ${price.toLocaleString()}
          </Card.Text>

          {showAddToCart && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addToCart({ ...product, quantity: 1 })}
            >
              <BsCart4 />
            </Button>
          )}

          <Link
            to={`/product/${productId}`}
            className="btn btn-outline-primary btn-sm"
          >
            <IoArrowRedo />
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
