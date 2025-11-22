"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect, useMemo } from "react";
import { useUserMutations } from "../hooks/useUserMutation";
import type { User } from "@/types/user";
import Button from "@/components/ui/button";
export default function AddEditUserDialog({ user }: { user?: User }) {
  const isEdit = !!user;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    company: user?.company?.name ?? "",
  });

const initialForm = useMemo(() => {
  if (!user || !open) return null;

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company?.name ?? "",
  };
}, [user, open]);

// useEffect(() => {
//   if (initialForm) setForm(initialForm);
// }, [initialForm]);


  const { addUser, editUser } = useUserMutations();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: { name: form.company },
      address: { street: "", city: "", zipcode: "" },
    } as Omit<User, "id">;

    if (isEdit && user) {
      await editUser.mutateAsync({ ...user, ...payload });
    } else {
      await addUser.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="px-3 py-1" asChild>
       <Button variant="primary">{isEdit ? "Edit" : "Add User"}</Button> 
      </Dialog.Trigger>
      <Dialog.Content className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 border rounded p-4 w-[400px] shadow">
          <Dialog.Title className="font-semibold mb-2">
            {isEdit ? "Edit user" : "Add user"}
          </Dialog.Title>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border rounded w-full px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="border rounded w-full px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="border rounded w-full px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="border rounded w-full px-2 py-1"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close className="px-3 py-1 border rounded">Cancel</Dialog.Close>
              <button type="submit" className="px-3 py-1 border rounded bg-blue-600 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}