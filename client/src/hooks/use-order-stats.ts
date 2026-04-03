import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

export function useOrderStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["order-stats"],
    queryFn: async (): Promise<OrderStats> => {
      const res = await fetch("/api/admin/orders/stats");
      if (!res.ok) throw new Error("Failed to fetch order stats");
      return res.json();
    },
    enabled: !!user?.isAdmin,
  });

  return {
    stats: stats || {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
    },
    isLoading,
  };
}
