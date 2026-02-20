
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    id: string; // This could be inconsistent if IDs aren't unique across restaurants
    name: string;
    price: number;
    quantity: number;
    restaurantId: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    openCart: () => void;
    closeCart: () => void;
    isCartOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === newItem.id);

            // Check if adding item from a different restaurant
            if (currentItems.length > 0 && currentItems[0].restaurantId !== newItem.restaurantId) {
                // Option 1: Prevent adding
                // toast.error("You can only order from one restaurant at a time.");
                // return currentItems;

                // Option 2: Clear cart and add new (Simpler for MVP, but maybe too aggressive?)
                // Let's go with a prompt or just clear it for now with a warning? 
                // For a seamless UX, let's just clear it and notify.
                toast.info("Started a new order from a different restaurant. Previous cart cleared.");
                return [{ ...newItem, quantity: 1 }];
            }

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            toast.success(`Added ${newItem.name} to cart`);
            return [...currentItems, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                openCart,
                closeCart,
                isCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
