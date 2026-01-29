import 'tailwindcss';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});
    const { register: registerUser, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.name) {
            newErrors.name = 'Имя обязательно';
        }

        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Некорректный номер телефона';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone || undefined
        };

        const result = await registerUser(userData);

        if (result.success) {
            navigate('/profile_page');
        }
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    {/* Заголовок */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Регистрация</h2>
                        <p className="text-gray-600 mt-2">Создайте аккаунт для доступа к личному кабинету</p>
                    </div>

                    {/* Ошибка сервера */}
                    {authError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {authError}
                        </div>
                    )}

                    {/* Форма */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Имя и фамилия */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Имя и фамилия *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Иван Иванов"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@mail.com"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Телефон */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+7 (999) 123-45-67"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                disabled={loading}
                            />
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">Необязательно</p>
                        </div>

                        {/* Пароль */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Пароль *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Не менее 6 символов"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Подтверждение пароля */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Подтверждение пароля *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Повторите пароль"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Чекбокс согласия */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                Я согласен с{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-800 hover:underline">
                                    правилами
                                </Link>{' '}
                                и{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline">
                                    политикой конфиденциальности
                                </Link>
                            </label>
                        </div>

                        {/* Кнопка регистрации */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 
                     transform hover:-translate-y-0.5 hover:shadow-lg 
                     disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                     flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Регистрация...</span>
                                </>
                            ) : (
                                'Зарегистрироваться'
                            )}
                        </button>
                    </form>

                    {/* Разделитель */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Уже есть аккаунт?</span>
                        </div>
                    </div>

                    {/* Ссылка на вход */}
                    <Link
                        to="/login"
                        className="block w-full text-center border-2 border-blue-600 text-blue-600 
                   hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Войти в существующий аккаунт
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register;