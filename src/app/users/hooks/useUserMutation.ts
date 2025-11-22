// src/app/users/hooks/useUserMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User } from "@/types/user";

export function useUserMutations() {
  const qc = useQueryClient();

  const addUser = useMutation({
    mutationFn: async (payload: Omit<User, "id">) => {
      const { data } = await api.post<User>("/users", payload);
      return { ...payload, id: data?.id ?? Math.floor(Math.random() * 10_000) };
    },
    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const snapshots = qc
        .getQueryCache()
        .findAll({ queryKey: ["users"] })
        .map((q) => ({
          key: q.queryKey,
          prev: qc.getQueryData(q.queryKey) as { rows: User[]; total: number },
        }));
      snapshots.forEach(({ key, prev }) => {
        if (!prev) return;
        qc.setQueryData(key, {
          rows: [{ id: Math.random(), ...newUser } as User, ...prev.rows],
          total: prev.total + 1,
        });
      });
      return { snapshots };
    },
    onError: (_err, _newUser, ctx) => {
      ctx?.snapshots?.forEach(({ key, prev }) => {
        if (prev) qc.setQueryData(key, prev);
      });
    },
    onSuccess: (created, _newUser, ctx) => {
      ctx?.snapshots?.forEach(({ key, prev }) => {
        if (!prev) return;
        qc.setQueryData(key, (curr?: { rows: User[]; total: number }) => {
          if (!curr) return prev;
          return {
            rows: [created, ...curr.rows.filter((r) => r.id !== created.id)],
            total: curr.total,
          };
        });
      });
    },
  });

  const editUser = useMutation({
    mutationFn: async (user: User) => {
      await api.put(`/users/${user.id}`, user);
      return user;
    },
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const snapshots = qc
        .getQueryCache()
      .findAll({ queryKey: ["users"] })
        .map((q) => ({
          key: q.queryKey,
          prev: qc.getQueryData(q.queryKey) as { rows: User[]; total: number },
        }));
      snapshots.forEach(({ key, prev }) => {
        if (!prev) return;
        qc.setQueryData(key, {
          rows: prev.rows.map((r) => (r.id === updated.id ? updated : r)),
          total: prev.total,
        });
      });
      qc.setQueryData(["user", updated.id], updated);
      return { snapshots };
    },
    onError: (_err, _updated, ctx) => {
      ctx?.snapshots?.forEach(({ key, prev }) => prev && qc.setQueryData(key, prev));
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const snapshots = qc
        .getQueryCache()
      .findAll({ queryKey: ["users"] })
        .map((q) => ({
          key: q.queryKey,
          prev: qc.getQueryData(q.queryKey) as { rows: User[]; total: number },
        }));
      snapshots.forEach(({ key, prev }) => {
        if (!prev) return;
        qc.setQueryData(key, {
          rows: prev.rows.filter((r) => r.id !== id),
          total: Math.max(prev.total - 1, 0),
        });
      });
      qc.removeQueries({ queryKey: ["user", id], exact: true });
      return { snapshots };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshots?.forEach(({ key, prev }) => prev && qc.setQueryData(key, prev));
    },
  });

  return { addUser, editUser, deleteUser };
}
