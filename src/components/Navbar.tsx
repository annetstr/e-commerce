import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import "../css/Navbar.css"


const Navbar: React.FC = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);

                const response = await fetch('http://localhost:3000/api/categories');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setCategory(data.categories);
                console.log(data.categories)
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
        <div className="navbar">
            <div className="wrapper">
                <Link to={'/'}><button className="logo"></button></Link>
                <button><a href="#"></a>Каталог</button>
                {category && (<ul className='category-prod-nav'>
                    {category.map((category) => (
                        <li><Link to={`/category/${category}`}>{category.toUpperCase()}
                        </Link></li>

                    ))}
                </ul>)}
            </div>
            {user && (<div>
                <ul>
                    <Link to={'/profile_page'}><li className="items1"><a>User</a></li></Link>
                    <li className="items2"><a href="#">Заказы</a></li>
                    <li className="items3"><a href="#">Избранное</a></li>
                    <li className="items4"><a href="#">Корзина</a></li>
                </ul>
            </div>)}
            {!user && (
                <ul>
                    <Link to={'/login'}><li className="items1"><a>Войти</a></li></Link>
                </ul>)
            }

        </div>
    );
}

export default Navbar;