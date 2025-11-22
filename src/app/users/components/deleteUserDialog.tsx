"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useUserMutations } from "../hooks/useUserMutation";
import Button from "@/components/ui/button";
export default function DeleteUserDialog({ id }: { id: number }) {
  const { deleteUser } = useUserMutations();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="px-3 py-1" asChild>
       <Button variant="danger">Delete</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 border rounded p-4 w-[360px] shadow">
          <AlertDialog.Title className="font-semibold mb-2">Delete user?</AlertDialog.Title>
          <AlertDialog.Description className="text-sm mb-4">
            This action will remove the user from the table.
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel className="px-3 py-1 border rounded">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={() => deleteUser.mutate(id)}
              className="px-3 py-1 border rounded bg-red-600 text-white"
            >
              Confirm
            </AlertDialog.Action>
          </div>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
