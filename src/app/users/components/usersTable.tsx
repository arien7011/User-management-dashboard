// src/app/users/components/UsersTable.tsx
"use client";
import Link from "next/link";
import type { User } from "@/types/user";
import DeleteUserDialog from "./deleteUserDialog";
import AddEditUserDialog from "./addEditUserDialog";
import initials from "@/utils/initials";

export default function UsersTable({ rows, isLoading }: { rows: User[]; isLoading: boolean }) {
  if (isLoading) return <div>Loading…</div>;
  return (
    <div className="overflow-auto rounded border">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="px-3 py-2 text-left">Avatar</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Company</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-t hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <td className="px-3 py-2">
                <div className="w-8 h-8 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold">
                  {initials(u.name)}
                </div>
              </td>
              <td className="px-3 py-2">
                <Link href={`/users/${u.id}`} className="text-blue-600 hover:underline">
                  {u.name}
                </Link>
              </td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.phone}</td>
              <td className="px-3 py-2">{u.company?.name}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <AddEditUserDialog user={u} />
                  <DeleteUserDialog id={u.id} />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-center text-neutral-500" colSpan={6}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
