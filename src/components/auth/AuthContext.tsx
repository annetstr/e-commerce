import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Базовый URL API
const API_BASE_URL = 'http://localhost:3000/api';

// Создаем экземпляр axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Для отправки cookies
});
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    // Устанавливаем access токен в заголовки
    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            localStorage.setItem('accessToken', accessToken);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    // Интерцептор для автоматического обновления токена
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Если ошибка 401 и это не запрос на обновление токена
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Пытаемся обновить токен
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );

                    const newAccessToken = response.data.accessToken;
                    setAccessToken(newAccessToken);

                    // Повторяем оригинальный запрос с новым токеном
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Если обновление токена не удалось, разлогиниваем пользователя
                    logout();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    // Загрузка данных пользователя
    const fetchUserProfile = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/user/profile');
            setUser(response.data.user);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
            setError('Не удалось загрузить данные пользователя');
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    // Автоматическая загрузка профиля при изменении accessToken
    useEffect(() => {
        if (accessToken) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [accessToken, fetchUserProfile]);

    // Регистрация
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/register', userData);

            setAccessToken(response.data.accessToken);
            setUser(response.data.user);
            setError(null);

            console.log('📝 Токен установлен:', response.data.accessToken ? 'Да' : 'Нет');
            console.log('👤 Пользователь установлен:', response.data.user);
            console.log('🔐 localStorage token:', localStorage.getItem('accessToken'));
            console.log('👤 localStorage user:', localStorage.getItem('user'));

            return { success: true, data: response.data };
        } catch (err) {
            console.error('❌ Ошибка регистрации:', err);
            const errorMessage = err.response?.data?.error || 'Ошибка серстрации';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Вход
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/login', { email, password });

            setAccessToken(response.data.accessToken);
            setUser(response.data.user);
            setError(null);

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка входа';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Выход
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        } finally {
            setAccessToken(null);
            setUser(null);
            setError(null);
        }
    };

    // Обновление профиля
    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/user/profile', profileData);
            setUser(response.data.user);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка обновления';
            return { success: false, error: errorMessage };
        }
    };

    // Смена пароля
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/user/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Ошибка смены пароля';
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        accessToken,
        api,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        fetchUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};