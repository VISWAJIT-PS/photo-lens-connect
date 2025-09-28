import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export interface CartItem {
  id: string
  rentalId: number
  quantity: number
  rentalDate: string
  returnDate: string
  totalPrice: number
  // Rental details (would be fetched separately)
  rental?: {
    id: number
    name: string
    category: string
    price: string
    image_url?: string
    location: string
    available: boolean
  }
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  totalDays: number
  currency: string
}

export const useEquipmentCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load cart items from localStorage
  const loadCartItems = useCallback(() => {
    if (!user?.id) {
      setCartItems([])
      return
    }

    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      if (savedCart) {
        const items = JSON.parse(savedCart)
        setCartItems(items)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error loading cart items:', error)
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Save cart items to localStorage
  const saveCartItems = useCallback((items: CartItem[]) => {
    if (!user?.id) return
    localStorage.setItem(`cart-${user.id}`, JSON.stringify(items))
  }, [user?.id])

  // Load cart items when user changes
  useEffect(() => {
    loadCartItems()
  }, [loadCartItems])

  // Add item to cart
  const addToCart = useCallback(({
    rentalId,
    quantity,
    rentalDate,
    returnDate
  }: {
    rentalId: number
    quantity: number
    rentalDate: string
    returnDate: string
  }) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      })
      return
    }

    const totalPrice = calculateTotalPrice(rentalId, quantity, rentalDate, returnDate)
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      rentalId,
      quantity,
      rentalDate,
      returnDate,
      totalPrice
    }

    const updatedItems = [...cartItems, newItem]
    setCartItems(updatedItems)
    saveCartItems(updatedItems)

    toast({
      title: 'Added to Cart',
      description: 'Item has been added to your cart'
    })
  }, [cartItems, saveCartItems, toast, user?.id])

  // Update cart item quantity
  const updateCartItem = useCallback(({
    cartItemId,
    quantity,
    rentalDate,
    returnDate
  }: {
    cartItemId: string
    quantity: number
    rentalDate?: string
    returnDate?: string
  }) => {
    const item = cartItems.find(item => item.id === cartItemId)
    if (!item) return

    const totalPrice = calculateTotalPrice(
      item.rentalId,
      quantity,
      rentalDate || item.rentalDate,
      returnDate || item.returnDate
    )

    const updatedItems = cartItems.map(item =>
      item.id === cartItemId
        ? {
            ...item,
            quantity,
            rentalDate: rentalDate || item.rentalDate,
            returnDate: returnDate || item.returnDate,
            totalPrice
          }
        : item
    )

    setCartItems(updatedItems)
    saveCartItems(updatedItems)

    toast({
      title: 'Cart Updated',
      description: 'Cart item has been updated'
    })
  }, [cartItems, saveCartItems, toast])

  // Remove item from cart
  const removeFromCart = useCallback((cartItemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== cartItemId)
    setCartItems(updatedItems)
    saveCartItems(updatedItems)

    toast({
      title: 'Removed from Cart',
      description: 'Item has been removed from your cart'
    })
  }, [cartItems, saveCartItems, toast])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([])
    if (user?.id) {
      localStorage.removeItem(`cart-${user.id}`)
    }

    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart'
    })
  }, [toast, user?.id])

  // Reserve cart items (placeholder for booking process)
  const reserveCart = useCallback(() => {
    // In a real implementation, this would move items to a reservation
    toast({
      title: 'Items Reserved',
      description: 'Your cart items have been reserved for booking'
    })
  }, [toast])

  // Calculate cart summary
  const getCartSummary = useCallback((): CartSummary => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

    // Calculate total days (approximate)
    const totalDays = cartItems.reduce((sum, item) => {
      const rentalDate = new Date(item.rentalDate)
      const returnDate = new Date(item.returnDate)
      const days = Math.ceil((returnDate.getTime() - rentalDate.getTime()) / (1000 * 60 * 60 * 24))
      return sum + (days * item.quantity)
    }, 0)

    return {
      totalItems,
      totalPrice,
      totalDays,
      currency: 'USD'
    }
  }, [cartItems])

  return {
    cartItems,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    reserveCart,
    getCartSummary,
    refreshCart: loadCartItems
  }
}

// Helper function to calculate total price
const calculateTotalPrice = (
  rentalId: number,
  quantity: number,
  rentalDate: string,
  returnDate: string
): number => {
  // This would typically fetch the rental price from the database
  // For now, we'll use a simple calculation
  const rentalDateObj = new Date(rentalDate)
  const returnDateObj = new Date(returnDate)
  const days = Math.ceil((returnDateObj.getTime() - rentalDateObj.getTime()) / (1000 * 60 * 60 * 24))

  // Mock price calculation - in real app, this would come from the rental record
  const basePrice = 50 // Base daily price
  return basePrice * days * quantity
}