export interface Category {
    id: string;
    name: string;
    color: string;
    createdAt: string;
  }
  
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    categories: string[];
  }