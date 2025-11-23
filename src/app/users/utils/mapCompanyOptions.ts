import { User } from "@/types/user";

export function getCompanyOptions(users: User[]) {
  const unique = Array.from(new Set(users.map((u) => u.company?.name).filter(Boolean)));
  return unique.sort();
}