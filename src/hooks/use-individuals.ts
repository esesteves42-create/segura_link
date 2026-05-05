import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIndividual,
  deleteIndividual,
  fetchIndividuals,
  updateIndividualStatus,
  type CreateIndividualInput,
} from "@/lib/gps-api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { TrackedIndividual } from "@/types/gps";
import type { IndividualStatus } from "@/types/database";

export function useIndividuals() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery<TrackedIndividual[]>({
    queryKey: ["individuals", user?.id ?? "anon"],
    queryFn: fetchIndividuals,
    enabled: !!user,
    staleTime: 60_000,
  });

  // Realtime: refetch da lista quando há mudanças nos individuals do user
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`individuals-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "individuals", filter: `owner_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["individuals", user.id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const createMutation = useMutation({
    mutationFn: (input: CreateIndividualInput) => createIndividual(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals", user?.id ?? "anon"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IndividualStatus }) =>
      updateIndividualStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals", user?.id ?? "anon"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIndividual(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals", user?.id ?? "anon"] });
    },
  });

  return {
    individuals: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

/**
 * Garante que o utilizador autenticado tem um "individual" para si próprio
 * (chamado "Eu", tipo "person"). Cria automaticamente se não existir.
 * Devolve o ID desse individual ou null enquanto carrega.
 */
export function useMyIndividual(): { id: string | null; isLoading: boolean } {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<TrackedIndividual[]>({
    queryKey: ["individuals", user?.id ?? "anon"],
    queryFn: fetchIndividuals,
    enabled: !!user,
    staleTime: 60_000,
  });

  const ensureMutation = useMutation({
    mutationFn: () =>
      createIndividual({
        name: "Eu",
        type: "person",
        color: "#10b981",
        status: "active",
        metadata: { auto_created: true, kind: "self" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals", user?.id ?? "anon"] });
    },
  });

  useEffect(() => {
    if (!user) return;
    if (query.isLoading) return;
    if (ensureMutation.isPending) return;

    const myInd = (query.data ?? []).find(
      (i) => (i.metadata as Record<string, unknown> | undefined)?.kind === "self",
    );

    if (!myInd) {
      ensureMutation.mutate();
    }
  }, [user, query.isLoading, query.data, ensureMutation]);

  const myInd = (query.data ?? []).find(
    (i) => (i.metadata as Record<string, unknown> | undefined)?.kind === "self",
  );

  return {
    id: myInd?.id ?? null,
    isLoading: query.isLoading || ensureMutation.isPending,
  };
}
