// src/app/users/hooks/useUsersQuery.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User } from "@/types/user";

type Params = {
  page: number;
  pageSize: number;
  search?: string;
  company?: string;
  sort?: "email-asc" | "email-desc";
};

export function useUsersQuery(params: Params) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/users");
      // Client-side pagination/filter/sort for this API (since it’s static)
      let rows = data;
      if (params.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter((u) => u.name.toLowerCase().includes(q));
      }
      if (params.company) {
        rows = rows.filter((u) => u.company?.name === params.company);
      }
      if (params.sort === "email-asc") {
        rows = rows.slice().sort((a, b) => a.email.localeCompare(b.email));
      } else if (params.sort === "email-desc") {
        rows = rows.slice().sort((a, b) => b.email.localeCompare(a.email));
      }
      const start = (params.page - 1) * params.pageSize;
      const paged = rows.slice(start, start + params.pageSize);
      return { rows: paged, total: rows.length };
    },
    // keepPreviousData: true, // avoids full reload on page change
  });
}
