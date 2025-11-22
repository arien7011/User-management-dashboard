import { User } from '@/types/user';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type authState = {user:User | null,setUser:(u:User) => void}

export const  useAuthStore = create<authState>()(
    persist(
        (set) => ({
            user:null,
            setUser:(u) => set({user:u}),
            }),
            {name:'auth-user'}
    )
)