import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface SavedAddress {
  id: number;
  userId: number;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
}

export function useAddresses(userId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: addresses, isLoading } = useQuery<SavedAddress[]>({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`${API_BASE}/api/addresses?userId=${userId}`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SavedAddress, "id" | "userId" | "createdAt">) => {
      if (!userId) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE}/api/addresses?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      toast({ title: "Address saved", description: "Your address has been saved." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SavedAddress> }) => {
      if (!userId) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE}/api/addresses/${id}?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      toast({ title: "Address updated", description: "Your address has been updated." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!userId) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE}/api/addresses/${id}?userId=${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      toast({ title: "Address deleted", description: "Your address has been removed." });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!userId) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE}/api/addresses/${id}/default?userId=${userId}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to set default address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
      toast({ title: "Default set", description: "This is now your default address." });
    },
  });

  return {
    addresses: addresses || [],
    isLoading,
    createAddress: createMutation.mutateAsync,
    updateAddress: updateMutation.mutateAsync,
    deleteAddress: deleteMutation.mutateAsync,
    setDefaultAddress: setDefaultMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
