import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./UserContext"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { getToken, isAuthenticated } = useUser()

  const fetchCart = async () => {
    if (!isAuthenticated) return

    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error fetching cart")

      setCart(data.cart) // ← importante
    } catch (err) {
      console.error("Error fetching cart:", err)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      const { id: product_id, price } = product

      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ product_id, quantity, price }), // ← AÑADIR PRECIO
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error adding to cart: ${errorText}`)
      }

      await fetchCart()
    } catch (err) {
      console.error("Error adding product to cart:", err)
    }
  }

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error updating quantity")

      await fetchCart()
    } catch (err) {
      console.error("Error updating quantity:", err)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error deleting product")

      fetchCart()
    } catch (err) {
      console.error("Error removing product from cart:", err)
    }
  }

  const increaseQty = async (itemId) => {
    const item = cart.find((i) => i.id === itemId)
    if (item) {
      await updateItemQuantity(itemId, item.quantity + 1)
    }
  }

  const decreaseQty = async (itemId) => {
    const item = cart.find((i) => i.id === itemId)
    if (item) {
      if (item.quantity <= 1) {
        await removeFromCart(itemId)
      } else {
        await updateItemQuantity(itemId, item.quantity - 1)
      }
    }
  }

  const clearCart = async () => {
    const deletions = cart.map((item) => removeFromCart(item.id))
    await Promise.all(deletions)
  }

  const buyCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/complete-payment", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error completing payment")

      fetchCart()
    } catch (err) {
      console.error("Error at checkout:", err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

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
  )
}
