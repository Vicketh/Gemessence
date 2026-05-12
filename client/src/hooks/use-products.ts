import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct } from "@/lib/supabase";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}
