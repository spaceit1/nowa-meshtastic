export interface Category {
  id: string;
  name_en: string;
  name_pl: string;
  name_uk: string;
  name_ru: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name_en: string;
  name_pl: string;
  name_uk: string;
  name_ru: string;
} 