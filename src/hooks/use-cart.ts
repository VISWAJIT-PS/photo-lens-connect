import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

export interface CartItem {
  id: number
  rental_id: number
  user_id: string
  quantity: number
  rental_date: string
  return_date: string
  total_price: number
  status: 'active' | 'reserved' | 'cancelled'
  created_at: string
  updated_at: string
  // Rental details
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

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Load cart items from localStorage (since cart_items table doesn't exist)
  const loadCartItems = useCallback(async () => {
    if (!user?.id) {
      setCartItems([])
      return
    }

    setIsLoading(true)
    try {
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      const cartData = savedCart ? JSON.parse(savedCart) : []

      // Convert localStorage data to CartItem format
      const items: CartItem[] = cartData.map((item: any) => ({
        id: item.id,
        rental_id: item.rentalId,
        user_id: user.id,
        quantity: item.quantity,
        rental_date: item.rentalDate,
        return_date: item.returnDate,
        total_price: item.totalPrice,
        status: item.status || 'active',
        created_at: item.createdAt || new Date().toISOString(),
        updated_at: item.updatedAt || new Date().toISOString(),
        rental: item.rental
      }))

      setCartItems(items)
    } catch (error) {
      console.error('Error loading cart items:', error)
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Load cart items when user changes
  useEffect(() => {
    loadCartItems()
  }, [loadCartItems])

  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async ({
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
      if (!user?.id) throw new Error('User not authenticated')

      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.rental_id === rentalId)

      if (existingItem) {
        // Update existing cart item in localStorage
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
          rental_date: rentalDate,
          return_date: returnDate,
          total_price: calculateTotalPrice(rentalId, existingItem.quantity + quantity, rentalDate, returnDate),
          updated_at: new Date().toISOString()
        }

        const updatedCartItems = cartItems.map(item =>
          item.rental_id === rentalId ? updatedItem : item
        )
        setCartItems(updatedCartItems)

        // Save to localStorage
        const savedCart = localStorage.getItem(`cart-${user.id}`)
        const cartData = savedCart ? JSON.parse(savedCart) : []
        const updatedCartData = cartData.map((item: any) =>
          item.rentalId === rentalId
            ? { ...item, quantity: updatedItem.quantity, rentalDate, returnDate, totalPrice: updatedItem.total_price, updatedAt: updatedItem.updated_at }
            : item
        )
        localStorage.setItem(`cart-${user.id}`, JSON.stringify(updatedCartData))

        return updatedItem
      } else {
        // Create new cart item
        const totalPrice = calculateTotalPrice(rentalId, quantity, rentalDate, returnDate)
        const newItem: CartItem = {
          id: Date.now(), // Simple ID generation
          rental_id: rentalId,
          user_id: user.id,
          quantity,
          rental_date: rentalDate,
          return_date: returnDate,
          total_price: totalPrice,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const updatedCartItems = [...cartItems, newItem]
        setCartItems(updatedCartItems)

        // Save to localStorage
        const savedCart = localStorage.getItem(`cart-${user.id}`)
        const cartData = savedCart ? JSON.parse(savedCart) : []
        const newCartData = [...cartData, {
          id: newItem.id,
          rentalId,
          quantity,
          rentalDate,
          returnDate,
          totalPrice,
          status: 'active',
          createdAt: newItem.created_at,
          updatedAt: newItem.updated_at
        }]
        localStorage.setItem(`cart-${user.id}`, JSON.stringify(newCartData))

        return newItem
      }
    },
    onSuccess: () => {
      loadCartItems()
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
      toast({
        title: 'Added to Cart',
        description: 'Item has been added to your cart'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive'
      })
    }
  })

  // Update cart item quantity
  const updateCartItem = useMutation({
    mutationFn: async ({
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
      if (!user?.id) throw new Error('User not authenticated')

      const item = cartItems.find(item => item.id.toString() === cartItemId)
      if (!item) throw new Error('Cart item not found')

      const totalPrice = calculateTotalPrice(
        item.rental_id,
        quantity,
        rentalDate || item.rental_date,
        returnDate || item.return_date
      )

      const updatedItem = {
        ...item,
        quantity,
        rental_date: rentalDate || item.rental_date,
        return_date: returnDate || item.return_date,
        total_price: totalPrice,
        updated_at: new Date().toISOString()
      }

      const updatedCartItems = cartItems.map(cartItem =>
        cartItem.id.toString() === cartItemId ? updatedItem : cartItem
      )
      setCartItems(updatedCartItems)

      // Update localStorage
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      const cartData = savedCart ? JSON.parse(savedCart) : []
      const updatedCartData = cartData.map((cartItem: any) =>
        cartItem.id.toString() === cartItemId
          ? {
              ...cartItem,
              quantity,
              rentalDate: rentalDate || cartItem.rentalDate,
              returnDate: returnDate || cartItem.returnDate,
              totalPrice,
              updatedAt: updatedItem.updated_at
            }
          : cartItem
      )
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(updatedCartData))

      return updatedItem
    },
    onSuccess: () => {
      loadCartItems()
      toast({
        title: 'Cart Updated',
        description: 'Cart item has been updated'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update cart item',
        variant: 'destructive'
      })
    }
  })

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async (cartItemId: string) => {
      if (!user?.id) throw new Error('User not authenticated')

      const updatedCartItems = cartItems.filter(item => item.id.toString() !== cartItemId)
      setCartItems(updatedCartItems)

      // Update localStorage
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      const cartData = savedCart ? JSON.parse(savedCart) : []
      const updatedCartData = cartData.filter((item: any) => item.id.toString() !== cartItemId)
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(updatedCartData))
    },
    onSuccess: () => {
      loadCartItems()
      toast({
        title: 'Removed from Cart',
        description: 'Item has been removed from your cart'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive'
      })
    }
  })

  // Clear entire cart
  const clearCart = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      setCartItems([])
      localStorage.removeItem(`cart-${user.id}`)
    },
    onSuccess: () => {
      loadCartItems()
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive'
      })
    }
  })

  // Reserve cart items (move to booking process)
  const reserveCart = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const updatedCartItems = cartItems.map(item => ({
        ...item,
        status: 'reserved' as const,
        updated_at: new Date().toISOString()
      }))
      setCartItems(updatedCartItems)

      // Update localStorage
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      const cartData = savedCart ? JSON.parse(savedCart) : []
      const updatedCartData = cartData.map((item: any) => ({
        ...item,
        status: 'reserved',
        updatedAt: new Date().toISOString()
      }))
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(updatedCartData))
    },
    onSuccess: () => {
      loadCartItems()
      toast({
        title: 'Items Reserved',
        description: 'Your cart items have been reserved for booking'
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reserve items',
        variant: 'destructive'
      })
    }
  })

  // Calculate cart summary
  const getCartSummary = useCallback((): CartSummary => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0)

    // Calculate total days (approximate)
    const totalDays = cartItems.reduce((sum, item) => {
      const rentalDate = new Date(item.rental_date)
      const returnDate = new Date(item.return_date)
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
    addToCart: addToCart.mutate,
    updateCartItem: updateCartItem.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    reserveCart: reserveCart.mutate,
    getCartSummary,
    refreshCart: loadCartItems,
    isAdding: addToCart.isPending,
    isUpdating: updateCartItem.isPending,
    isRemoving: removeFromCart.isPending,
    isClearing: clearCart.isPending,
    isReserving: reserveCart.isPending
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

// Hook for cart persistence in localStorage (fallback)
export const useLocalCart = () => {
  const [cart, setCart] = useState<{[key: number]: number}>({})

  useEffect(() => {
    const savedCart = localStorage.getItem('equipment-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error parsing saved cart:', error)
      }
    }
  }, [])

  const addToCart = (itemId: number, quantity: number = 1) => {
    const newCart = { ...cart, [itemId]: (cart[itemId] || 0) + quantity }
    setCart(newCart)
    localStorage.setItem('equipment-cart', JSON.stringify(newCart))
  }

  const removeFromCart = (itemId: number) => {
    const newCart = { ...cart }
    if (newCart[itemId] > 1) {
      newCart[itemId]--
    } else {
      delete newCart[itemId]
    }
    setCart(newCart)
    localStorage.setItem('equipment-cart', JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart({})
    localStorage.removeItem('equipment-cart')
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems
  }
}