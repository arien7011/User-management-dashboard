// src/app/users/hooks/useUserMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User } from "@/types/user";

type ListShape = { rows: User[]; total: number };

export function useUserMutations() {
  const qc = useQueryClient();

  // Helper to update all "users" caches (list variants with different params)
  const updateAllUserLists = (
    updater: (prev: ListShape | undefined) => ListShape | undefined
  ) => {
    const queries = qc.getQueryCache().findAll({ queryKey: ["users"] });
    queries.forEach((q) => {
      const prev = qc.getQueryData<ListShape>(q.queryKey);
      const next = updater(prev);
      if (next) qc.setQueryData(q.queryKey, next);
    });
  };

  const addUser = useMutation({
    // Do NOT send id; let json-server assign it
    mutationFn: async (payload: Omit<User, "id">) => {
      const { data } = await api.post<User>("/users", payload);
      return data; // must contain server-assigned id
    },

    // Optional optimistic insert with tempId
    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: ["users"] });

      const tempId = Date.now(); // temporary unique id
      updateAllUserLists((prev) => {
        if (!prev) return prev;
        return {
          rows: [{ ...newUser, id: tempId } as User, ...prev.rows],
          total: prev.total + 1,
        };
      });

      return { tempId };
    },

    onError: (_err, _newUser, ctx) => {
      // Rollback optimistic insert
      if (!ctx) return;
      const { tempId } = ctx as { tempId?: number };
      updateAllUserLists((prev) => {
        if (!prev) return prev;
        return {
          rows: prev.rows.filter((u) => u.id !== tempId),
          total: Math.max(prev.total - 1, 0),
        };
      });
    },

    onSuccess: (savedUser, _newUser, ctx) => {
      // Replace tempId row with the real server user
      const tempId = (ctx as { tempId?: number })?.tempId;
      updateAllUserLists((prev) => {
        if (!prev) return prev;
        const replaced =
          tempId != null
            ? prev.rows.map((u) => (u.id === tempId ? savedUser : u))
            : [savedUser, ...prev.rows]; // if no optimistic insert
        return {
          rows: replaced,
          total: prev.total, // total unchanged (we already incremented)
        };
      });

      // Also set/merge single-user cache
      qc.setQueryData(["user", savedUser.id], savedUser);
      // No invalidate needed; we just reconciled with server
    },
  });

  const editUser = useMutation({
    mutationFn: async (user: User) => {
      // Ensure numeric id for json-server
      const id = Number(user.id);
      // PATCH updates only changed fields; PUT can replace entire object
      const { data } = await api.patch<User>(`/users/${id}`, user);
      return data;
    },
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["users"] });

      updateAllUserLists((prev) => {
        if (!prev) return prev;
        return {
          rows: prev.rows.map((r) => (r.id === updated.id ? updated : r)),
          total: prev.total,
        };
      });

      qc.setQueryData(["user", Number(updated.id)], updated);
    },
    onError: (_err, _updated) => {
      // Optional: invalidate to refetch consistent data
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: (saved) => {
      // Ensure lists reflect server’s saved version
      updateAllUserLists((prev) => {
        if (!prev) return prev;
        return {
          rows: prev.rows.map((r) => (r.id === saved.id ? saved : r)),
          total: prev.total,
        };
      });
      qc.setQueryData(["user", Number(saved.id)], saved);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${Number(id)}`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["users"] });

      updateAllUserLists((prev) => {
        if (!prev) return prev;
        return {
          rows: prev.rows.filter((r) => r.id !== id),
          total: Math.max(prev.total - 1, 0),
        };
      });

      qc.removeQueries({ queryKey: ["user", Number(id)], exact: true });
    },
    onError: () => {
      // Optional: refetch to recover if delete failed
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { addUser, editUser, deleteUser };
}
