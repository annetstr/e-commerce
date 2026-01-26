import { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categories';
import { Category } from '../api/categories';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchCategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить категории');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading, error };
};