import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserRole } from "@/lib/supabase";
import { useToast } from "./use-toast";

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getUsers(),
  });

  const promoteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await updateUserRole(userId, true);
      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Success", description: "User has been promoted to admin." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to promote user.", variant: "destructive" });
    },
  });

  const demoteAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      await updateUserRole(userId, false);
      return { userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Success", description: "Admin has been demoted." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to demote admin.", variant: "destructive" });
    },
  });

  return {
    admins,
    isLoading,
    promoteUser: promoteUserMutation.mutate,
    demoteAdmin: demoteAdminMutation.mutate,
  };
}
