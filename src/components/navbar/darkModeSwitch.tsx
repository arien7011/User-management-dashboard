"use client";
import * as Switch from "@radix-ui/react-switch";
import { useThemeStore } from "@/store/themeStore";

export default function DarkModeSwitch() {
    const {dark,toggle} = useThemeStore();

    return (
        <div className="flex items-center">
            <span className="text-xs">Dark</span>
            <Switch.Root
            checked={dark}
            onCheckedChange={toggle}
             className="w-10 h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full relative data-[state=checked]:bg-neutral-600"
            >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 data-[state=checked]:translate-x-4 transition-transform" />
            </Switch.Root>
        </div>
    )

}