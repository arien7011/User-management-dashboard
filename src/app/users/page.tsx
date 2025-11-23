// src/app/users/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useUsersQuery } from './hooks/useUsersQuery';
import UsersTable from './components/usersTable';
import TableToolbar from './components/tableToolbar';
import AddEditUserDialog from './components/addEditUserDialog';
import { useAuthStore } from '@/store/authStore';
import { FaCaretRight, FaCaretLeft } from 'react-icons/fa6';
import { useDebounce } from './hooks/debounce';
export default function UsersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [company, setCompany] = useState<string | undefined>();
  const [sort, setSort] = useState<'email-asc' | 'email-desc' | undefined>(
    'email-asc'
  );
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading } = useUsersQuery({
    page,
    pageSize,
    search: debouncedSearch,
    company,
    sort,
  });
  const { data: base } = useUsersQuery({
    page: 1,
    pageSize: 1000, // or any large number to get all users
    search: '',
    company: undefined,
    sort: undefined,
  });

  const { user, setUser } = useAuthStore();
  useEffect(() => {
    if (!user && data?.rows?.[0]) setUser(data.rows[0]);
  }, [data, user, setUser]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          company={company}
          onCompanyChange={setCompany}
          sort={sort}
          onSortChange={setSort}
          users={base?.rows ?? []}
        />
        <AddEditUserDialog />
      </div>

      <UsersTable rows={data?.rows ?? []} isLoading={isLoading} />

      <div className="flex items-center justify-end gap-2">
        <button
          className="px-5 flex items-center py-2 rounded-md font-medium bg-gradient-to-r from-indigo-500 to-blue-600 text-white 
               shadow-md hover:shadow-lg transition-all duration-300 ease-in-out 
               hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          <FaCaretLeft className="text-white dark:text-white w-4 h-[1.4rem]" />
          Prev
        </button>
        <button
          className="px-5 flex items-center  py-2 rounded-md font-medium bg-gradient-to-r from-pink-500 to-red-600 text-white 
               shadow-md hover:shadow-lg transition-all duration-300 ease-in-out 
               hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            (data?.rows?.length ?? 0) < pageSize ||
            (data?.total ?? 0) <= page * pageSize
          }
          onClick={() => setPage((p) => p + 1)}
        >
          Next{' '}
          <FaCaretRight className="text-white dark:text-white w-4 h-[1.4rem]" />
        </button>
      </div>
    </div>
  );
}
