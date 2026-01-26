import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const CategoryFilter: React.FC = () => {
    const { categories, loading, error } = useCategories();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCategoryClick = (category: string) => {
        navigate(`/category/${category.toLowerCase()}`);
    };

    const getActiveCategory = () => {
        const path = location.pathname;
        if (path.startsWith('/category/')) {
            return path.split('/')[2];
        }
        return null;
    };

    const activeCategory = getActiveCategory();

    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-bold mb-3">Категории</h3>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-4">Категории</h3>

            <div className="space-y-2">
                {/* Кнопка "Все товары" */}
                <button
                    onClick={() => navigate('/products')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${!activeCategory
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Все товары
                    <span className="float-right text-gray-400">
                        {/* Здесь можно показать общее количество товаров */}
                    </span>
                </button>

                {/* Список категорий */}
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${activeCategory === category.name.toLowerCase()
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {category.name}
                        <span className="float-right text-gray-400 text-sm">
                            {category.productCount || ''}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;