import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProductDiscount, type InsertProductDiscount } from "@shared/schema";
import { useToast } from "./use-toast";

export function useProductDiscounts(productId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ["discounts", productId],
    queryFn: async () => {
      const res = await fetch("/api/admin/discounts");
      if (!res.ok) throw new Error("Failed to fetch discounts");
      const allDiscounts = await res.json();
      
      if (productId) {
        return allDiscounts.filter((d: any) => d.productId === productId);
      }
      return allDiscounts;
    },
  });

  const createDiscountMutation = useMutation({
    mutationFn: async (discount: {
      productId: number;
      discountType: 'percentage' | 'fixed';
      discountValue: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discount),
      });
      if (!res.ok) throw new Error("Failed to create discount");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast({
        title: "Success",
        description: "Discount created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create discount.",
        variant: "destructive",
      });
    },
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ProductDiscount>;
    }) => {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update discount");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast({
        title: "Success",
        description: "Discount updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update discount.",
        variant: "destructive",
      });
    },
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete discount");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast({
        title: "Success",
        description: "Discount deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete discount.",
        variant: "destructive",
      });
    },
  });

  return {
    discounts,
    isLoading,
    createDiscount: createDiscountMutation.mutate,
    updateDiscount: updateDiscountMutation.mutate,
    deleteDiscount: deleteDiscountMutation.mutate,
  };
}
