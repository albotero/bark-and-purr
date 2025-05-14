import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Could not get cart");

      const data = await res.json();
      setCart(data.cart); 
    } catch (err) {
      console.error("Error getting cart:", err);
    }
  };
  
  const addToCart = async (product, quantity = 1) => {
    try {
      const { id: product_id } = product;
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ product_id, quantity }), 
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error adding to cart: ${errorText}`);
      }

      const data = await res.json(); 
      setCart(data.cart); 
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };
  

  const updateItemQuantity = async (itemId, quantity) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error updating quantity");

      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting product");

      fetchCart();
    } catch (err) {
      console.error("Error removing product from cart:", err);
    }
  };

  const increaseQty = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (item) updateItemQuantity(itemId, item.quantity + 1);
  };

  const decreaseQty = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      if (item.quantity <= 1) removeFromCart(itemId);
      else updateItemQuantity(itemId, item.quantity - 1);
    }
  };

  const clearCart = async () => {
    const deletions = cart.map((item) => removeFromCart(item.id));
    await Promise.all(deletions);
  };

  const buyCart = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/cart/complete-payment",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error completing payment");

      fetchCart(); 
    } catch (err) {
      console.error("Error at checkout:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        buyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

