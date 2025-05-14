import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types/template';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const CategoryPanel: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Omit<Category, 'id'>>({
        name: '',
    });

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
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Kategoria została usunięta');
            fetchCategories();
        } catch (error) {
            toast.error('Błąd podczas usuwania kategorii');
            console.error('Error deleting category:', error);
        }
    };

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="space-y-6">
            <Card
                title="Dodaj nową kategorię"
                variant="default"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nazwa kategorii
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <Button type="submit">Dodaj kategorię</Button>
                </form>
            </Card>

            <Card
                title="Lista kategorii"
                variant="default"
            >
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="font-medium">{category.name}</div>
                            <Button
                                variant="danger"
                                onClick={() => handleDelete(category.id)}
                            >
                                Usuń
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}


export default CategoryPanel;