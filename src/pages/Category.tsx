import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import '../css/Category.css'

const Category = () => {
    const { category } = useParams<{ category: string }>();
    console.log(category)

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!category) return;
        const fetchCategories = async () => {
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:3000/api/products/category/${category}`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products);
                console.log(data.products);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить товары');
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };
        if (category) {
            fetchCategories();
        }
    }, [category]);

    return (
        <>
            <Navbar />
            <header>
                <h1>{category.toUpperCase()}</h1>
                <p>{products.length} товаров</p>
            </header>
            <main>
                <div className='category-grid'>
                    {category && (
                        products.map((prod) => (
                            <div className='product-card'>
                                <Link to={`/product/${prod['id']}`}><img src={prod['img']} alt="" /></Link>
                                <Link to={`/product/${prod['id']}`}><p>{prod['name']}</p></Link>
                                <p>{prod['price']} ₽</p>
                            </div>
                        ))
                    )}</div>
            </main>
            <Footer />
        </>
    )
}

export default Category;