import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types/template';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import EditModal from '../ui/EditModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import MoreMenu from '../ui/MoreMenu';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';

const CategoryPanel: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Omit<Category, 'id'>>({
        name: '',
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            toast.error('Błąd podczas pobierania kategorii');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
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

            toast.success('Kategoria została dodana');
            setFormData({
                name: '',
            });
            fetchCategories();
        } catch (error) {
            toast.error('Błąd podczas dodawania kategorii');
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
                .update({ name: formData.name })
                .eq('id', selectedCategory.id);

            if (error) throw error;

            toast.success('Kategoria została zaktualizowana');
            setIsEditModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error('Błąd podczas aktualizacji kategorii');
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

            toast.success('Kategoria została usunięta');
            setIsDeleteModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error('Błąd podczas usuwania kategorii');
            console.error('Error deleting category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card
                title="Dodaj nową kategorię"
                variant="default"
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nazwa kategorii"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Wprowadź nazwę kategorii"
                        icon={<FiTag />}
                    />
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        <FiPlus className="w-5 h-5" />
                        {isSubmitting ? 'Dodawanie...' : 'Dodaj kategorię'}
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
                            <div className="font-medium text-gray-800 dark:text-gray-200">{category.name}</div>
                            <MoreMenu
                                items={[
                                    {
                                        label: 'Edytuj',
                                        icon: <FiEdit2 />,
                                        onClick: () => openEditModal(category)
                                    },
                                    {
                                        label: 'Usuń',
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
                title="Edytuj kategorię"
                isLoading={isSubmitting}
            >
                <Input
                    label="Nazwa kategorii"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    required
                    icon={<FiTag />}
                />
            </EditModal>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Potwierdź usunięcie"
                message={`Czy na pewno chcesz usunąć kategorię "${selectedCategory?.name}"?`}
                isLoading={isSubmitting}
            />
        </div>
    );
}

export default CategoryPanel;