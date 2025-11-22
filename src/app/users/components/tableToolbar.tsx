"use client";
import * as Select from "@radix-ui/react-select";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  company?: string;
  onCompanyChange: (v?: string) => void;
  sort?: "email-asc" | "email-desc";
  onSortChange: (v?: "email-asc" | "email-desc") => void;
};

export default function TableToolbar(props: Props) {
  type SortValue = "email-asc" | "email-desc" | "";

  const { search, onSearchChange, company, onCompanyChange, sort, onSortChange } = props;

  return (
    <div className="flex flex-wrap gap-2">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name…"
        className="border rounded px-2 py-1 w-56"
      />

      <Select.Root value={company ?? ""} onValueChange={(v) => onCompanyChange(v || undefined)}>
<Select.Trigger
  className="border rounded-md px-4 py-2 w-48 text-left font-medium 
             bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-700 
             hover:shadow-md transition-all duration-300 ease-in-out"
>
  <Select.Value placeholder="Filter by company" />
</Select.Trigger>
<Select.Content
  position="popper"
  sideOffset={6}
  className="z-50 bg-white dark:bg-neutral-800 border rounded-md shadow-lg p-1"
>
  <Select.Item
    value="all"
    className="px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 dark:hover:bg-neutral-700 transition"
  >
    <Select.ItemText>All companies</Select.ItemText>
  </Select.Item>
  <Select.Item
    value="Romaguera-Crona"
    className="px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 dark:hover:bg-neutral-700 transition"
  >
    <Select.ItemText>Romaguera-Crona</Select.ItemText>
  </Select.Item>
</Select.Content>
      </Select.Root>

      <Select.Root value={sort ?? ""}  onValueChange={(v: SortValue) => onSortChange(v || undefined)}>
        <Select.Trigger className="border rounded-md px-4 py-2 w-48 text-left font-medium 
             bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-700 
             hover:shadow-md transition-all duration-300 ease-in-out">
          <Select.Value placeholder="Sort by email" />
        </Select.Trigger>
        <Select.Content  position="popper"
  sideOffset={6}
  className="z-50 bg-white dark:bg-neutral-800 border rounded-md shadow-lg p-1">
          <Select.Item value="email-asc">
            <Select.ItemText  className="px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 dark:hover:bg-neutral-700 transition">Email A–Z</Select.ItemText>
          </Select.Item>
          <Select.Item value="email-desc"  className="px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 dark:hover:bg-neutral-700 transition">
            <Select.ItemText>Email Z–A</Select.ItemText>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
