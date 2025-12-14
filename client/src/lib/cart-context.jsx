import { createContext, useContext, useState } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("Wash & Fold");

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.garment === item.garment && i.serviceType === item.serviceType
      );
      if (existing) {
        return prev.map((i) =>
          i.garment === item.garment && i.serviceType === item.serviceType
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (garment, serviceType) => {
    setItems((prev) =>
      prev.filter((i) => !(i.garment === garment && i.serviceType === serviceType))
    );
  };

  const updateQuantity = (garment, serviceType, quantity) => {
    if (quantity <= 0) {
      removeItem(garment, serviceType);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.garment === garment && i.serviceType === serviceType
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
        selectedServiceType,
        setSelectedServiceType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
