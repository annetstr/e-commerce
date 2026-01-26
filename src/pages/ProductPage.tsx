import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/ProductPage.css'


const ProductPage = () => {
    const { id } = useParams();

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);

                const response = await fetch(`http://localhost:3000/api/products/${id}`)
                console.log(response)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data);
                console.log(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить товары');
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    return (
        <>
            <Navbar />
            <main>
                {id && (
                    < div className='card' >
                        {/* <div className='card-img-cat'> */}
                        <div className='card-img'><img src={product['img']} alt='' />
                            <Link to={`/category/${product['category']}`}><p id='cat-link'>Категория: <span>{product['category']}</span></p></Link>
                        </div>
                        {/* </div> */}
                        <div className='description-card'>
                            <h2>{product['name']}</h2>
                            <p className='prod-price'>{product['price']} ₽</p>
                            <p className='prod-desc'>Описание товара: {product['description']}</p>
                            <p className='prod-rec'>Отзывы: 365</p></div>
                    </div>

                )}
            </main >
            <Footer />
        </>
    )
}

export default ProductPage;