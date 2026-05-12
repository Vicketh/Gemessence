import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "./use-toast";
import { getOrders, getOrder as getOrderSupabase, createOrder as createOrderSupabase } from "@/lib/supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface CheckoutData {
  shippingFirstName: string;
  shippingLastName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCounty: string;
  shippingPostalCode?: string;
  shippingInstructions?: string;
  paymentMethod: "mpesa" | "card" | "bank_transfer";
  mpesaPhoneNumber?: string;
  saveAddress?: boolean;
}

export function useOrders(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];
      if (API_BASE) {
        const res = await fetch(`${API_BASE}${api.orders.list.path}?userId=${userId}`, { credentials: "include" });
        if (!res.ok) return [];
        return res.json();
      }
      return getOrders(userId);
    },
    enabled: !!userId,
  });

  const createOrderMutation = useMutation({
    mutationFn: async ({ checkoutData, sessionId, userId }: { checkoutData: CheckoutData; sessionId: string; userId?: number }) => {
      if (API_BASE) {
        const params = new URLSearchParams();
        params.set("sessionId", sessionId);
        if (userId) params.set("userId", String(userId));
        const res = await fetch(`${API_BASE}${api.orders.create.path}?${params.toString()}`, {
          method: api.orders.create.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutData),
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Failed to create order" }));
          throw new Error(err.message);
        }
        return res.json();
      }
      // Supabase fallback
      return createOrderSupabase({ ...checkoutData, user_id: userId || null });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Order Placed Successfully!",
        description: `Your order number is ${data.orderNumber || data.order_number}. Check your email for confirmation.`,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Order Failed", description: error.message, variant: "destructive" });
    },
  });

  return {
    orders,
    isLoading,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
  };
}

export function useOrder(orderId?: number) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      if (API_BASE) {
        const res = await fetch(`${API_BASE}${api.orders.get.path.replace(":id", String(orderId))}`, { credentials: "include" });
        if (!res.ok) return null;
        return res.json();
      }
      return getOrderSupabase(orderId);
    },
    enabled: !!orderId,
  });
}

export function useShippingCost(county?: string) {
  return useQuery({
    queryKey: ["shipping", county],
    queryFn: async () => {
      if (!county) return { cost: 500, county: "" };
      if (API_BASE) {
        const res = await fetch(`${API_BASE}${api.shipping.cost.path.replace(":county", county)}`);
        if (!res.ok) return { cost: 500, county };
        return res.json();
      }
      return { cost: 500, county };
    },
    enabled: !!county,
  });
}
