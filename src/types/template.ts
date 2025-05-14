export interface Template {
    id: string;
    name: string;
    category: string;
    priority: string;
    usageCount: number;
    content: string;
}

export interface Category {
    id: string;
    name: string;
} 