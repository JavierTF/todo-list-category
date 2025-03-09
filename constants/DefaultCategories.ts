import { Category } from "@/types/common.type";

export const DEFAULT_CATEGORIES: Category[] = [
    {
        id: 'personal',
        name: 'Personal',
        color: '#FF9500',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'trabajo',
        name: 'Trabajo',
        color: '#007AFF',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'compras',
        name: 'Compras',
        color: '#4CD964',
        createdAt: new Date().toISOString(),
    }
];