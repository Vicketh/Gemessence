import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { useToast } from "./use-toast";

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/superuser/admins");
      if (!res.ok) throw new Error("Failed to fetch admins");
      return res.json();
    },
  });

  const promoteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/superuser/admins/${userId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to promote user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Success",
        description: "User has been promoted to admin.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to promote user.",
        variant: "destructive",
      });
    },
  });

  const demoteAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/superuser/admins/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to demote admin");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Success",
        description: "Admin has been demoted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to demote admin.",
        variant: "destructive",
      });
    },
  });

  return {
    admins,
    isLoading,
    promoteUser: promoteUserMutation.mutate,
    demoteAdmin: demoteAdminMutation.mutate,
  };
}
