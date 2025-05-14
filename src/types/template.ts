import type { Category } from './category';

export interface Template {
    id: string;
    name_pl: string;
    name_en: string;
    name_uk: string;
    name_ru: string;
    content_pl: string;
    content_en: string;
    content_uk: string;
    content_ru: string;
    category_id: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    created_at?: string;
    updated_at?: string;
    categories?: Category;
}

export interface TemplateFormData {
    name_pl: string;
    name_en: string;
    name_uk: string;
    name_ru: string;
    content_pl: string;
    content_en: string;
    content_uk: string;
    content_ru: string;
    category_id: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Category {
    id: string;
    name: string;
} 