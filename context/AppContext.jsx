"use client"
import axios from "axios"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

export const AppContext = createContext()

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY
  const router = useRouter()

  const { user } = useUser()
  const { getToken } = useAuth()

  const [products, setProducts] = useState([])
  const [userData, setUserData] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
  const [cartItems, setCartItems] = useState({})

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list")
      if (data?.success) setProducts(data.products)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true)
        console.log(JSON.stringify(user) + " is a SELLER!")
      } else {
        console.log(JSON.stringify(user) + " is 'NOT' a SELLER!")
      }
      const token = await getToken()
      const header = {
        header: {
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.get("/api/user/data", header)
      if (data.success) {
        setUserData(data?.user)
        setCartItems(data?.user?.cartItems)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems)
    console.log(
      `cartItems: ${JSON.stringify(cartItems)}, cartData: ${JSON.stringify(
        cartData
      )}`
    )

    if (cartData !== undefined && cartData[itemId]) {
      cartData[itemId] += 1
    } else {
      cartData[itemId] = 1
    }
    setCartItems(cartData)
    toast.success("Item added to cart")

    if (user) {
      try {
        const token = await getToken()
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        await axios.post("/api/cart/update", { cartData }, headers)
        toast.success("Item added to cart.")
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems)
    if (quantity === 0) {
      delete cartData[itemId]
    } else {
      cartData[itemId] = quantity
    }
    setCartItems(cartData)
    if (user) {
      try {
        const token = await getToken()
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        await axios.post("/api/cart/update", headers)
        toast.success("Cart updated.")
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items]
      }
    }
    return totalCount
  }

  const getCartAmount = () => {
    let totalAmount = 0
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items)
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalAmount * 100) / 100
  }

  useEffect(() => {
    if (user) fetchUserData()
  }, [user])

  useEffect(() => {
    fetchProductData()
  }, [])

  const value = {
    getToken,
    user,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}
