import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "KES" | "USD";

const EXCHANGE_RATE = 130; // 1 USD = 130 KES (approximate)

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  convertPrice: (priceKES: number | string) => number;
  formatPrice: (priceKES: number | string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("currency") as Currency) || "KES";
    }
    return "KES";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "KES" ? "USD" : "KES"));
  };

  const convertPrice = (priceKES: number | string): number => {
    const numericPrice = typeof priceKES === "string" ? parseFloat(priceKES) : priceKES;
    if (currency === "KES") {
      return numericPrice;
    }
    return numericPrice / EXCHANGE_RATE;
  };

  const formatPrice = (priceKES: number | string): string => {
    const convertedPrice = convertPrice(priceKES);

    if (currency === "KES") {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(convertedPrice);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
