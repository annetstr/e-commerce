import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Типы
export interface Category {
    id?: number;
    name: string;
    slug?: string;
    productCount?: number;
}
// Получить все категории
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data.categories.map((cat: string, index: number) => ({
            id: index + 1,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-'),
        }));
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
        throw error;
    }
};
export const fetchProductsByCategory = async (category: string) => {
    try {
        const response = await axios.get(`${API_URL}/products/category/${category}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки товаров по категории:', error);
        throw error;
    }
};