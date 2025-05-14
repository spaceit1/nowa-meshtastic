import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category, CategoryFormData } from '../../types/category';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import EditModal from '../ui/EditModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import MoreMenu from '../ui/MoreMenu';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';

const CategoryPanel: React.FC = () => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [addFormData, setAddFormData] = useState<CategoryFormData>({
        name_pl: '',
        name_en: '',
        name_uk: '',
        name_ru: '',
    });
    const [editFormData, setEditFormData] = useState<CategoryFormData>({
        name_pl: '',
        name_en: '',
        name_uk: '',
        name_ru: '',
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isEditTranslating, setIsEditTranslating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            toast.error(t('errorFetchingCategories'));
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const translateText = async (text: string, targetLang: string) => {
        try {
            console.log('Wysyłanie żądania tłumaczenia:', { text, targetLang });

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
                console.error('Błąd odpowiedzi:', data);
                throw new Error(data.details || data.error || 'Błąd tłumaczenia');
            }

            console.log('Otrzymano tłumaczenie:', data.translatedText);
            return data.translatedText;
        } catch (error) {
            console.error('Błąd tłumaczenia:', error);
            throw error;
        }
    };

    const handleAutoTranslate = async () => {
        if (!addFormData.name_pl) return;

        setIsTranslating(true);
        try {
            const [en, uk, ru] = await Promise.all([
                translateText(addFormData.name_pl, 'EN'),
                translateText(addFormData.name_pl, 'UK'),
                translateText(addFormData.name_pl, 'RU'),
            ]);

            setAddFormData(prev => ({
                ...prev,
                name_en: en,
                name_uk: uk,
                name_ru: ru,
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
        if (!editFormData.name_pl) return;

        setIsEditTranslating(true);
        try {
            const [en, uk, ru] = await Promise.all([
                translateText(editFormData.name_pl, 'EN'),
                translateText(editFormData.name_pl, 'UK'),
                translateText(editFormData.name_pl, 'RU'),
            ]);

            setEditFormData(prev => ({
                ...prev,
                name_en: en,
                name_uk: uk,
                name_ru: ru,
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
                .from('categories')
                .insert([addFormData]);

            if (error) throw error;

            toast.success(t('categoryAdded'));
            setAddFormData({
                name_pl: '',
                name_en: '',
                name_uk: '',
                name_ru: '',
            });
            fetchCategories();
        } catch (error) {
            toast.error(t('errorAddingCategory'));
            console.error('Error adding category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!selectedCategory) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('categories')
                .update(editFormData)
                .eq('id', selectedCategory.id);

            if (error) throw error;

            toast.success(t('categoryUpdated'));
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(t('errorUpdatingCategory'));
            console.error('Error updating category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', selectedCategory.id);

            if (error) throw error;

            toast.success(t('categoryDeleted'));
            setIsDeleteModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(t('errorDeletingCategory'));
            console.error('Error deleting category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setEditFormData({
            name_pl: category.name_pl,
            name_en: category.name_en,
            name_uk: category.name_uk,
            name_ru: category.name_ru,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return <div>{t('loading')}</div>;
    }

    return (
        <div className="space-y-6 mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label={t('categoryNamePl')}
                    value={addFormData.name_pl}
                    onChange={(e) => setAddFormData({ ...addFormData, name_pl: e.target.value })}
                    required
                    placeholder={t('enterCategoryNamePl')}
                    icon={<FiTag />}
                    button={{
                        icon: <FiGlobe className="w-4 h-4" />,
                        onClick: handleAutoTranslate,
                        disabled: !addFormData.name_pl || isTranslating,
                        children: isTranslating ? t('translating') : t('translate')
                    }}
                />
                <Input
                    label={t('categoryNameEn')}
                    value={addFormData.name_en}
                    onChange={(e) => setAddFormData({ ...addFormData, name_en: e.target.value })}
                    placeholder={t('enterCategoryNameEn')}
                />
                <Input
                    label={t('categoryNameUk')}
                    value={addFormData.name_uk}
                    onChange={(e) => setAddFormData({ ...addFormData, name_uk: e.target.value })}
                    placeholder={t('enterCategoryNameUk')}
                />
                <Input
                    label={t('categoryNameRu')}
                    value={addFormData.name_ru}
                    onChange={(e) => setAddFormData({ ...addFormData, name_ru: e.target.value })}
                    placeholder={t('enterCategoryNameRu')}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                    <FiPlus className="w-5 h-5" />
                    {isSubmitting ? t('adding') : t('addCategory')}
                </Button>
            </form>

            <Card
                variant="default"
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700"
            >
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                        >
                            <div className="space-y-1">
                                <div className="font-medium text-gray-800 dark:text-gray-200">{category.name_pl}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {category.name_en} • {category.name_uk} • {category.name_ru}
                                </div>
                            </div>
                            <MoreMenu
                                items={[
                                    {
                                        label: t('edit'),
                                        icon: <FiEdit2 />,
                                        onClick: () => openEditModal(category)
                                    },
                                    {
                                        label: t('delete'),
                                        icon: <FiTrash2 />,
                                        onClick: () => openDeleteModal(category),
                                        variant: 'danger'
                                    }
                                ]}
                            />
                        </div>
                    ))}
                </div>
            </Card>

            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEdit}
                title={t('editCategory')}
                isLoading={isSubmitting}
            >
                <div className="space-y-4">
                    <Input
                        label={t('categoryNamePl')}
                        value={editFormData.name_pl}
                        onChange={(e) => setEditFormData({ ...editFormData, name_pl: e.target.value })}
                        required
                        placeholder={t('enterCategoryNamePl')}
                        icon={<FiTag />}
                        button={{
                            icon: <FiGlobe className="w-4 h-4" />,
                            onClick: handleEditAutoTranslate,
                            disabled: !editFormData.name_pl || isEditTranslating,
                            children: isEditTranslating ? t('translating') : t('translate')
                        }}
                    />
                    <Input
                        label={t('categoryNameEn')}
                        value={editFormData.name_en}
                        onChange={(e) => setEditFormData({ ...editFormData, name_en: e.target.value })}
                    />
                    <Input
                        label={t('categoryNameUk')}
                        value={editFormData.name_uk}
                        onChange={(e) => setEditFormData({ ...editFormData, name_uk: e.target.value })}
                    />
                    <Input
                        label={t('categoryNameRu')}
                        value={editFormData.name_ru}
                        onChange={(e) => setEditFormData({ ...editFormData, name_ru: e.target.value })}
                    />
                </div>
            </EditModal>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={t('confirmDelete')}
                message={t('confirmDeleteCategory', { name: selectedCategory?.name_pl })}
                isLoading={isSubmitting}
            />
        </div>
    );
}

export default CategoryPanel;