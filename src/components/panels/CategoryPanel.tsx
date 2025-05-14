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
    const [formData, setFormData] = useState<CategoryFormData>({
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
        if (!formData.name_pl) return;
        
        setIsTranslating(true);
        try {
            const [en, uk, ru] = await Promise.all([
                translateText(formData.name_pl, 'EN'),
                translateText(formData.name_pl, 'UK'),
                translateText(formData.name_pl, 'RU'),
            ]);

            setFormData(prev => ({
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('categories')
                .insert([formData]);

            if (error) throw error;

            toast.success(t('categoryAdded'));
            setFormData({
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
                .update(formData)
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
        setFormData({
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card
                title={t('addNewCategory')}
                variant="default"
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('categoryNamePl')}
                        value={formData.name_pl}
                        onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                        required
                        placeholder={t('enterCategoryNamePl')}
                        icon={<FiTag />}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={handleAutoTranslate}
                            disabled={!formData.name_pl || isTranslating}
                            className="flex items-center gap-2 text-sm"
                        >
                            <FiGlobe className="w-4 h-4" />
                            {isTranslating ? t('translating') : t('autoTranslate')}
                        </Button>
                    </div>
                    <Input
                        label={t('categoryNameEn')}
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder={t('enterCategoryNameEn')}
                    />
                    <Input
                        label={t('categoryNameUk')}
                        value={formData.name_uk}
                        onChange={(e) => setFormData({ ...formData, name_uk: e.target.value })}
                        placeholder={t('enterCategoryNameUk')}
                    />
                    <Input
                        label={t('categoryNameRu')}
                        value={formData.name_ru}
                        onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
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
            </Card>

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
                        value={formData.name_pl}
                        onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                        required
                        icon={<FiTag />}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={handleAutoTranslate}
                            disabled={!formData.name_pl || isTranslating}
                            className="flex items-center gap-2 text-sm"
                        >
                            <FiGlobe className="w-4 h-4" />
                            {isTranslating ? t('translating') : t('autoTranslate')}
                        </Button>
                    </div>
                    <Input
                        label={t('categoryNameEn')}
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    />
                    <Input
                        label={t('categoryNameUk')}
                        value={formData.name_uk}
                        onChange={(e) => setFormData({ ...formData, name_uk: e.target.value })}
                    />
                    <Input
                        label={t('categoryNameRu')}
                        value={formData.name_ru}
                        onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
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