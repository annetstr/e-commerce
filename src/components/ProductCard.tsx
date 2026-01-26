import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const ProductCard = () => {
    const [product, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setLoading(true);

                const response = await fetch(`//api/products/${key_id}`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
                console.log(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить товары');
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <></>
    )
}

export default ProductCard;