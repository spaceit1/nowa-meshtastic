import React, { useState, useEffect } from 'react';
import { FiPlus, FiGlobe, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EditModal from '../ui/EditModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import type { Category } from '../../types/category';
import MoreMenu from '../ui/MoreMenu';
import Badge from '../ui/Badge';
import type{ BadgeVariant } from '../ui/Badge';
import Select from '../ui/Select';

interface User {
  id: string;
  email: string;
}

interface UserTemplate {
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
  user_id: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    email: string;
  };
}

interface UserTemplateFormData {
  name_pl: string;
  name_en: string;
  name_uk: string;
  name_ru: string;
  content_pl: string;
  content_en: string;
  content_uk: string;
  content_ru: string;
  category_id: string;
  user_id: string;
}

const UserTemplatesPanel: React.FC = () => {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditTranslating, setIsEditTranslating] = useState(false);
  const [addFormData, setAddFormData] = useState<UserTemplateFormData>({
    name_pl: '',
    name_en: '',
    name_uk: '',
    name_ru: '',
    content_pl: '',
    content_en: '',
    content_uk: '',
    content_ru: '',
    category_id: '',
    user_id: ''
  });
  const [editFormData, setEditFormData] = useState<UserTemplateFormData>({
    name_pl: '',
    name_en: '',
    name_uk: '',
    name_ru: '',
    content_pl: '',
    content_en: '',
    content_uk: '',
    content_ru: '',
    category_id: '',
    user_id: ''
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .order('email');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error(t('errorFetchingUsers'));
      console.error('Error fetching users:', error);
    }
  };

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
        .from('user_templates')
        .select(`
          *,
          user:users (
            email
          ),
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
        .from('user_templates')
        .insert([addFormData]);

      if (error) throw error;

      toast.success(t('userTemplateAdded'));
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
        user_id: ''
      });
      setIsAddModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorAddingUserTemplate'));
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
        .from('user_templates')
        .update(editFormData)
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast.success(t('userTemplateUpdated'));
      setIsEditModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorUpdatingUserTemplate'));
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
        .from('user_templates')
        .delete()
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast.success(t('userTemplateDeleted'));
      setIsDeleteModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(t('errorDeletingUserTemplate'));
      console.error('Error deleting template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (template: UserTemplate) => {
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
      user_id: template.user_id
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (template: UserTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('userTemplates')}</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={FiPlus}
        >
          {t('addUserTemplate')}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">{t('loading')}</div>
      ) : templates.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-lg font-medium">{t('noUserTemplatesFound')}</p>
            <p className="text-gray-500">{t('noUserTemplatesFoundDescription')}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{template.name_pl}</h3>
                  <p className="text-sm text-gray-500">{template.user?.email}</p>
                </div>
                <MoreMenu
                  items={[
                    {
                      icon: FiEdit2,
                      label: t('edit'),
                      onClick: () => openEditModal(template)
                    },
                    {
                      icon: FiTrash2,
                      label: t('delete'),
                      onClick: () => openDeleteModal(template)
                    }
                  ]}
                />
              </div>
              <p className="text-gray-600 mb-4">{template.content_pl}</p>
              <div className="flex flex-wrap gap-2">
                {template.categories && (
                  <Badge variant="primary">
                    {template.categories.name_pl}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <EditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t('addUserTemplate')}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <Select
            label={t('user')}
            value={addFormData.user_id}
            onChange={(e) => setAddFormData(prev => ({ ...prev, user_id: e.target.value }))}
            required
          >
            <option value="">{t('selectUser')}</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </Select>
          <Input
            label={t('namePl')}
            value={addFormData.name_pl}
            onChange={(e) => setAddFormData(prev => ({ ...prev, name_pl: e.target.value }))}
            required
          />
          <Input
            label={t('nameEn')}
            value={addFormData.name_en}
            onChange={(e) => setAddFormData(prev => ({ ...prev, name_en: e.target.value }))}
          />
          <Input
            label={t('nameUk')}
            value={addFormData.name_uk}
            onChange={(e) => setAddFormData(prev => ({ ...prev, name_uk: e.target.value }))}
          />
          <Input
            label={t('nameRu')}
            value={addFormData.name_ru}
            onChange={(e) => setAddFormData(prev => ({ ...prev, name_ru: e.target.value }))}
          />
          <Input
            label={t('contentPl')}
            value={addFormData.content_pl}
            onChange={(e) => setAddFormData(prev => ({ ...prev, content_pl: e.target.value }))}
            multiline
            required
          />
          <Input
            label={t('contentEn')}
            value={addFormData.content_en}
            onChange={(e) => setAddFormData(prev => ({ ...prev, content_en: e.target.value }))}
            multiline
          />
          <Input
            label={t('contentUk')}
            value={addFormData.content_uk}
            onChange={(e) => setAddFormData(prev => ({ ...prev, content_uk: e.target.value }))}
            multiline
          />
          <Input
            label={t('contentRu')}
            value={addFormData.content_ru}
            onChange={(e) => setAddFormData(prev => ({ ...prev, content_ru: e.target.value }))}
            multiline
          />
          <Select
            label={t('category')}
            value={addFormData.category_id}
            onChange={(e) => setAddFormData(prev => ({ ...prev, category_id: e.target.value }))}
            required
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name_pl}</option>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button
              onClick={handleAutoTranslate}
              disabled={isTranslating || !addFormData.name_pl || !addFormData.content_pl}
              icon={FiGlobe}
            >
              {isTranslating ? t('translating') : t('autoTranslate')}
            </Button>
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('editUserTemplate')}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <Select
            label={t('user')}
            value={editFormData.user_id}
            onChange={(e) => setEditFormData(prev => ({ ...prev, user_id: e.target.value }))}
            required
          >
            <option value="">{t('selectUser')}</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </Select>
          <Input
            label={t('namePl')}
            value={editFormData.name_pl}
            onChange={(e) => setEditFormData(prev => ({ ...prev, name_pl: e.target.value }))}
            required
          />
          <Input
            label={t('nameEn')}
            value={editFormData.name_en}
            onChange={(e) => setEditFormData(prev => ({ ...prev, name_en: e.target.value }))}
          />
          <Input
            label={t('nameUk')}
            value={editFormData.name_uk}
            onChange={(e) => setEditFormData(prev => ({ ...prev, name_uk: e.target.value }))}
          />
          <Input
            label={t('nameRu')}
            value={editFormData.name_ru}
            onChange={(e) => setEditFormData(prev => ({ ...prev, name_ru: e.target.value }))}
          />
          <Input
            label={t('contentPl')}
            value={editFormData.content_pl}
            onChange={(e) => setEditFormData(prev => ({ ...prev, content_pl: e.target.value }))}
            multiline
            required
          />
          <Input
            label={t('contentEn')}
            value={editFormData.content_en}
            onChange={(e) => setEditFormData(prev => ({ ...prev, content_en: e.target.value }))}
            multiline
          />
          <Input
            label={t('contentUk')}
            value={editFormData.content_uk}
            onChange={(e) => setEditFormData(prev => ({ ...prev, content_uk: e.target.value }))}
            multiline
          />
          <Input
            label={t('contentRu')}
            value={editFormData.content_ru}
            onChange={(e) => setEditFormData(prev => ({ ...prev, content_ru: e.target.value }))}
            multiline
          />
          <Select
            label={t('category')}
            value={editFormData.category_id}
            onChange={(e) => setEditFormData(prev => ({ ...prev, category_id: e.target.value }))}
            required
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name_pl}</option>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button
              onClick={handleEditAutoTranslate}
              disabled={isEditTranslating || !editFormData.name_pl || !editFormData.content_pl}
              icon={FiGlobe}
            >
              {isEditTranslating ? t('translating') : t('autoTranslate')}
            </Button>
          </div>
        </div>
      </EditModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t('deleteUserTemplate')}
        message={t('deleteUserTemplateConfirmation')}
      />
    </div>
  );
};

export default UserTemplatesPanel; 