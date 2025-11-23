"use client";
import { useParams, useRouter } from "next/navigation";
import { useUserDetailQuery } from "../hooks/useUserDetailQuery";
import { useAuditStore } from "@/store/auditStore";
import { useEffect } from "react";
import { FaEnvelope, FaPhone,FaAddressBook,FaBuilding} from "react-icons/fa";
import {FaCaretLeft } from "react-icons/fa6";
export default function UserDetailPage() {
  const { id } = useParams() as { id: string };
  const userId = Number(id);
  const { data: user, isLoading, error } = useUserDetailQuery(userId);
  const { log } = useAuditStore();
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    log({ ts: Date.now(), type: "view_user", payload: { id: userId } });
  }, [userId]);

  if (isLoading) return <div className="text-center py-10 text-lg">Loading…</div>;
  if (!user || error) return <div className="text-center py-10 text-lg text-red-600">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => router.push("/users")}
          className="mb-6 flex px-5 py-2 rounded-md font-medium bg-gradient-to-r from-indigo-500 to-blue-600 text-white 
                     shadow-md hover:shadow-lg transition-all duration-300 ease-in-out 
                     hover:scale-105 active:scale-95"
        >
        <FaCaretLeft className="text-white dark:text-white w-4 h-[1.4rem]" /> Back to Users
        </button>

        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
          {user.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
           <div className="flex gap-2">
          <FaEnvelope className="text-indigo-600 dark:text-indigo-300 w-4 h-[1.4rem]" />
        <div>
      <span className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Email</span>
      <div className="text-neutral-800 dark:text-neutral-100">{user.email}</div>
    </div>
  </div>

  <div className="flex gap-2">
    <FaPhone className="text-indigo-600 dark:text-indigo-300 mt-1 w-4 h-[1.4rem]" />
    <div>
      <span className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1">Phone</span>
      <div className="text-neutral-800 dark:text-neutral-100">{user.phone}</div>
    </div>
    </div>

          <div className="flex gap-2">
            <FaAddressBook className="text-indigo-600 dark:text-indigo-300 mt-1 w-4 h-[1.4rem]" />
             <div>
              <span className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1"> Company</span>
            <div className="text-neutral-800 dark:text-neutral-100">{user.company?.name}</div>
             </div>
          </div>

          <div className="flex gap-2">
             <FaBuilding className="text-indigo-600 dark:text-indigo-300 mt-1 w-4 h-[1.4rem]" />
             <div>
            <span className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1"> Address</span>
            <div className="text-neutral-800 dark:text-neutral-100">
              {user.address?.street}, {user.address?.city}, {user.address?.zipcode}
            </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
