import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProfilePage() {
    const [formError, setFormError] = useState('');
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        logout();
        navigate('/');
    };

    return (
        <>
            {user && (
                <> <Navbar />
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold mb-6">Личный кабинет</h2>
                        {/* Информация о пользователе */}
                        {user && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <p>Вы вошли как: <strong>{user.name}</strong></p>
                                <p>Email: {user.email}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={handleSubmit}>Выйти</button>
                    <Footer /></>)}
        </>
    )
}

export default ProfilePage;