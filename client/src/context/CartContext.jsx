import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useUser } from "./UserContext"
import { useApi } from "../hooks/useApi"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { getToken, isAuthenticated } = useUser()
  const [fetchData] = useApi()

  const getCartItem = (productId) => cart.find((item) => item.product_id === productId)

  const fetchCart = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        throw new Error("Not authenticated")
      }
      const { error, cart } = await fetchData({
        method: "GET",
        endpoint: "cart",
        token: getToken(),
      })
      if (error) throw new Error(error)
      setCart(cart) // ← Aquí se actualiza el carrito
    } catch (err) {
      console.error("Error fetching cart:", err)
    }
  }, [isAuthenticated, fetchData, getToken])

  const addToCart = async (product, quantity = 1) => {
    try {
      const { id: product_id, price } = product
      const { error } = await fetchData({
        method: "POST",
        endpoint: "cart",
        body: { product_id, quantity, price }, // ← AÑADIR PRECIO
        token: getToken(),
      })
      if (error) throw new Error(error)
      await fetchCart()
    } catch (err) {
      console.error("Error adding product to cart:", err)
    }
  }

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const { error } = await fetchData({
        method: "PUT",
        endpoint: `cart/${itemId}`,
        body: { quantity: newQuantity },
        token: getToken(),
      })
      if (error) throw new Error(error)
      await fetchCart()
    } catch (err) {
      console.error("Error updating quantity:", err)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const { error } = await fetchData({
        method: "DELETE",
        endpoint: `cart/${itemId}`,
        token: getToken(),
      })
      if (error) throw new Error(error)
      await fetchCart()
    } catch (err) {
      console.error("Error removing product from cart:", err)
    }
  }

  const increaseQty = async (itemId) => {
    const item = getCartItem(itemId)
    if (item) {
      await updateItemQuantity(itemId, item.quantity + 1)
    }
  }

  const decreaseQty = async (itemId) => {
    const item = getCartItem(itemId)
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
      const { error } = await fetchData({
        method: "PUT",
        endpoint: "cart/complete-payment",
        token: getToken(),
      })
      if (error) throw new Error(error)
      fetchCart()
    } catch (err) {
      console.error("Error at checkout:", err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [fetchCart, isAuthenticated])

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
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
