import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "./use-toast";

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
    queryKey: [api.orders.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${api.orders.list.path}?userId=${userId}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!userId,
  });

  const getOrderQuery = useQuery({
    queryKey: [api.orders.get.path],
    queryFn: async (orderId: number) => {
      const res = await fetch(`${api.orders.get.path.replace(':id', String(orderId))}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: false,
  });

  const createOrderMutation = useMutation({
    mutationFn: async ({ checkoutData, sessionId }: { checkoutData: CheckoutData; sessionId: string }) => {
      const userId = 1; // For MVP - replace with actual user ID from auth
      const res = await fetch(`${api.orders.create.path}?userId=${userId}&sessionId=${sessionId}`, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to create order" }));
        throw new Error(err.message);
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({
        title: "Order Placed Successfully!",
        description: `Your order number is ${data.orderNumber}. Check your email for confirmation.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    orders,
    isLoading,
    getOrder: getOrderQuery.refetch,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
  };
}

export function useOrder(orderId?: number) {
  return useQuery({
    queryKey: [api.orders.get.path, orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await fetch(`${api.orders.get.path.replace(':id', String(orderId))}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!orderId,
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const [counties, metalTypes, gemstoneTypes, ringSizes, chainLengths] = await Promise.all([
        fetch(api.config.counties.path).then(res => res.json()),
        fetch(api.config.metalTypes.path).then(res => res.json()),
        fetch(api.config.gemstoneTypes.path).then(res => res.json()),
        fetch(api.config.ringSizes.path).then(res => res.json()),
        fetch(api.config.chainLengths.path).then(res => res.json()),
      ]);
      return { counties, metalTypes, gemstoneTypes, ringSizes, chainLengths };
    },
  });
}

export function useShippingCost(county?: string) {
  return useQuery({
    queryKey: [api.shipping.cost.path, county],
    queryFn: async () => {
      if (!county) return { cost: 0, county: "" };
      const res = await fetch(api.shipping.cost.path.replace(':county', county));
      if (!res.ok) return { cost: 500, county };
      return res.json();
    },
    enabled: !!county,
  });
}
