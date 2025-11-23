import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User } from "@/types/user";

type ListShape = { rows: User[]; total: number };

export function useUserMutations() {
  const qc = useQueryClient();

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
    mutationFn: async (payload: Omit<User, "id">) => {
      const { data } = await api.post<User>("/users", payload);
      return data;
    },

    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: ["users"] });

      const tempId = Date.now();
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
      const tempId = (ctx as { tempId?: number })?.tempId;
      updateAllUserLists((prev) => {
        if (!prev) return prev;
        const replaced =
          tempId != null
            ? prev.rows.map((u) => (u.id === tempId ? savedUser : u))
            : [savedUser, ...prev.rows]; 
        return {
          rows: replaced,
          total: prev.total,
        };
      });

      qc.setQueryData(["user", savedUser.id], savedUser);
    },
  });

  const editUser = useMutation({
    mutationFn: async (user: User) => {
      const id = Number(user.id);
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: (saved) => {
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
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { addUser, editUser, deleteUser };
}
