import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/use-currency";
import { DollarSign, Coins } from "lucide-react";

export function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCurrency}
      className="border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all"
      title={`Switch to ${currency === "KES" ? "USD" : "KES"}`}
    >
      {currency === "KES" ? (
        <span className="flex items-center gap-1 text-xs font-semibold">
          <Coins className="w-3 h-3" />
          KES
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-semibold">
          <DollarSign className="w-3 h-3" />
          USD
        </span>
      )}
    </Button>
  );
}
