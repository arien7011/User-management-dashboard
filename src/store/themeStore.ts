import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type themeState = {dark:boolean , toggle:() => void};
export const useThemeStore = create<themeState>()(
    persist(
       (set,get) => ({
        dark:false,
        toggle:() => set({dark:!get().dark}),
       }),
       {name:'theme-store'}
        )
)