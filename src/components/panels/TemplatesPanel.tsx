import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EditModal from '../ui/EditModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import type { Category } from '../../types/category';

interface Template {
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
  priority: string;
  usageCount: number;
  created_at?: string;
  updated_at?: string;
}

interface TemplateFormData {
  name_pl: string;
  name_en: string;
  name_uk: string;
  name_ru: string;
  content_pl: string;
  content_en: string;
  content_uk: string;
  content_ru: string;
  category_id: string;
  priority: string;
}

const TemplatesPanel: React.FC = () => {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditTranslating, setIsEditTranslating] = useState(false);
  const [addFormData, setAddFormData] = useState<TemplateFormData>({
    name_pl: '',
    name_en: '',
    name_uk: '',
    name_ru: '',
    content_pl: '',
    content_en: '',
    content_uk: '',
    content_ru: '',
    category_id: '',
    priority: 'medium'
  });
  const [editFormData, setEditFormData] = useState<TemplateFormData>({
    name_pl: '',
    name_en: '',
    name_uk: '',
    name_ru: '',
    content_pl: '',
    content_en: '',
    content_uk: '',
    content_ru: '',
    category_id: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_pl');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error(t('errorFetchingCategories'));
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          categories (
            name_pl,
            name_en,
            name_uk,
            name_ru
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast.error(t('errorFetchingTemplates'));
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const translateText = async (text: string, targetLang: string) => {
    try {
      const apiPort = import.meta.env.VITE_API_PORT || '3000';
      const response = await fetch(`http://localhost:${apiPort}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Błąd tłumaczenia');
      }

      return data.translatedText;
    } catch (error) {
      console.error('Błąd tłumaczenia:', error);
      throw error;
    }
  };

  const handleAutoTranslate = async () => {
    if (!addFormData.name_pl || !addFormData.content_pl) return;

    setIsTranslating(true);
    try {
      const [nameEn, nameUk, nameRu, contentEn, contentUk, contentRu] = await Promise.all([
        translateText(addFormData.name_pl, 'EN'),
        translateText(addFormData.name_pl, 'UK'),
        translateText(addFormData.name_pl, 'RU'),
        translateText(addFormData.content_pl, 'EN'),
        translateText(addFormData.content_pl, 'UK'),
        translateText(addFormData.content_pl, 'RU'),
      ]);

      setAddFormData(prev => ({
        ...prev,
        name_en: nameEn,
        name_uk: nameUk,
        name_ru: nameRu,
        content_en: contentEn,
        content_uk: contentUk,
        content_ru: contentRu,
      }));

      toast.success(t('translationSuccess'));
    } catch (error) {
      toast.error(t('translationError'));
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEditAutoTranslate = async () => {
    if (!editFormData.name_pl || !editFormData.content_pl) return;

    setIsEditTranslating(true);
    try {
      const [nameEn, nameUk, nameRu, contentEn, contentUk, contentRu] = await Promise.all([
        translateText(editFormData.name_pl, 'EN'),
        translateText(editFormData.name_pl, 'UK'),
        translateText(editFormData.name_pl, 'RU'),
        translateText(editFormData.content_pl, 'EN'),
        translateText(editFormData.content_pl, 'UK'),
        translateText(editFormData.content_pl, 'RU'),
      ]);

      setEditFormData(prev => ({
        ...prev,
        name_en: nameEn,
        name_uk: nameUk,
        name_ru: nameRu,
        content_en: contentEn,
        content_uk: contentUk,
        content_ru: contentRu,
      }));

      toast.success(t('translationSuccess'));
    } catch (error) {
      toast.error(t('translationError'));
      console.error('Translation error:', error);
    } finally {
      setIsEditTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('templates')
        .insert([addFormData]);

      if (error) throw error;

      toast.success(t('templateAdded'));
      setAddFormData({
        name_pl: '',
        name_en: '',
        name_uk: '',
        name_ru: '',
        content_pl: '',
        content_en: '',
        content_uk: '',
        content_ru: '',
        category_id: '',
        priority: 'medium'
      });
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorAddingTemplate'));
      console.error('Error adding template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('templates')
        .update(editFormData)
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast.success(t('templateUpdated'));
      setIsEditModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorUpdatingTemplate'));
      console.error('Error updating template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast.success(t('templateDeleted'));
      setIsDeleteModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorDeletingTemplate'));
      console.error('Error deleting template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (template: Template) => {
    setSelectedTemplate(template);
    setEditFormData({
      name_pl: template.name_pl,
      name_en: template.name_en,
      name_uk: template.name_uk,
      name_ru: template.name_ru,
      content_pl: template.content_pl,
      content_en: template.content_en,
      content_uk: template.content_uk,
      content_ru: template.content_ru,
      category_id: template.category_id,
      priority: template.priority
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="space-y-6 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('templateNamePl')}
          value={addFormData.name_pl}
          onChange={(e) => setAddFormData({ ...addFormData, name_pl: e.target.value })}
          required
          placeholder={t('enterTemplateNamePl')}
          button={{
            icon: <FiGlobe className="w-4 h-4" />,
            onClick: handleAutoTranslate,
            disabled: !addFormData.name_pl || !addFormData.content_pl || isTranslating,
            children: isTranslating ? t('translating') : t('translate')
          }}
        />
        <Input
          label={t('templateNameEn')}
          value={addFormData.name_en}
          onChange={(e) => setAddFormData({ ...addFormData, name_en: e.target.value })}
          placeholder={t('enterTemplateNameEn')}
        />
        <Input
          label={t('templateNameUk')}
          value={addFormData.name_uk}
          onChange={(e) => setAddFormData({ ...addFormData, name_uk: e.target.value })}
          placeholder={t('enterTemplateNameUk')}
        />
        <Input
          label={t('templateNameRu')}
          value={addFormData.name_ru}
          onChange={(e) => setAddFormData({ ...addFormData, name_ru: e.target.value })}
          placeholder={t('enterTemplateNameRu')}
        />
        <Input
          label={t('templateContentPl')}
          value={addFormData.content_pl}
          onChange={(e) => setAddFormData({ ...addFormData, content_pl: e.target.value })}
          required
          placeholder={t('enterTemplateContentPl')}
        />
        <Input
          label={t('templateContentEn')}
          value={addFormData.content_en}
          onChange={(e) => setAddFormData({ ...addFormData, content_en: e.target.value })}
          placeholder={t('enterTemplateContentEn')}
        />
        <Input
          label={t('templateContentUk')}
          value={addFormData.content_uk}
          onChange={(e) => setAddFormData({ ...addFormData, content_uk: e.target.value })}
          placeholder={t('enterTemplateContentUk')}
        />
        <Input
          label={t('templateContentRu')}
          value={addFormData.content_ru}
          onChange={(e) => setAddFormData({ ...addFormData, content_ru: e.target.value })}
          placeholder={t('enterTemplateContentRu')}
        />
        <select
          value={addFormData.category_id}
          onChange={(e) => setAddFormData({ ...addFormData, category_id: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">{t('selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_pl}
            </option>
          ))}
        </select>
        <select
          value={addFormData.priority}
          onChange={(e) => setAddFormData({ ...addFormData, priority: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">{t('priorityLow')}</option>
          <option value="medium">{t('priorityMedium')}</option>
          <option value="high">{t('priorityHigh')}</option>
          <option value="critical">{t('priorityCritical')}</option>
        </select>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
        >
          <FiPlus className="w-5 h-5" />
          {isSubmitting ? t('adding') : t('addTemplate')}
        </Button>
      </form>

      <Card
        variant="default"
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <div className="font-medium text-gray-800 dark:text-gray-200">{template.name_pl}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {template.name_en} • {template.name_uk} • {template.name_ru}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('category')}: {template.categories?.name_pl}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('content')}: {template.content_pl}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(template.priority)}`}>
                  {t(template.priority)}
                </span>
                <button
                  className="px-3 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md"
                  onClick={() => openEditModal(template)}
                >
                  {t('edit')}
                </button>
                <button
                  className="px-3 py-1 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md"
                  onClick={() => openDeleteModal(template)}
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        title={t('editTemplate')}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <Input
            label={t('templateNamePl')}
            value={editFormData.name_pl}
            onChange={(e) => setEditFormData({ ...editFormData, name_pl: e.target.value })}
            required
            placeholder={t('enterTemplateNamePl')}
            button={{
              icon: <FiGlobe className="w-4 h-4" />,
              onClick: handleEditAutoTranslate,
              disabled: !editFormData.name_pl || !editFormData.content_pl || isEditTranslating,
              children: isEditTranslating ? t('translating') : t('translate')
            }}
          />
          <Input
            label={t('templateNameEn')}
            value={editFormData.name_en}
            onChange={(e) => setEditFormData({ ...editFormData, name_en: e.target.value })}
            placeholder={t('enterTemplateNameEn')}
          />
          <Input
            label={t('templateNameUk')}
            value={editFormData.name_uk}
            onChange={(e) => setEditFormData({ ...editFormData, name_uk: e.target.value })}
            placeholder={t('enterTemplateNameUk')}
          />
          <Input
            label={t('templateNameRu')}
            value={editFormData.name_ru}
            onChange={(e) => setEditFormData({ ...editFormData, name_ru: e.target.value })}
            placeholder={t('enterTemplateNameRu')}
          />
          <Input
            label={t('templateContentPl')}
            value={editFormData.content_pl}
            onChange={(e) => setEditFormData({ ...editFormData, content_pl: e.target.value })}
            required
            placeholder={t('enterTemplateContentPl')}
          />
          <Input
            label={t('templateContentEn')}
            value={editFormData.content_en}
            onChange={(e) => setEditFormData({ ...editFormData, content_en: e.target.value })}
            placeholder={t('enterTemplateContentEn')}
          />
          <Input
            label={t('templateContentUk')}
            value={editFormData.content_uk}
            onChange={(e) => setEditFormData({ ...editFormData, content_uk: e.target.value })}
            placeholder={t('enterTemplateContentUk')}
          />
          <Input
            label={t('templateContentRu')}
            value={editFormData.content_ru}
            onChange={(e) => setEditFormData({ ...editFormData, content_ru: e.target.value })}
            placeholder={t('enterTemplateContentRu')}
          />
          <select
            value={editFormData.category_id}
            onChange={(e) => setEditFormData({ ...editFormData, category_id: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_pl}
              </option>
            ))}
          </select>
          <select
            value={editFormData.priority}
            onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="low">{t('priorityLow')}</option>
            <option value="medium">{t('priorityMedium')}</option>
            <option value="high">{t('priorityHigh')}</option>
            <option value="critical">{t('priorityCritical')}</option>
          </select>
        </div>
      </EditModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t('confirmDelete')}
        message={t('confirmDeleteTemplate', { name: selectedTemplate?.name_pl })}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TemplatesPanel;