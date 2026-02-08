import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/Users.js';
import {
    generateAccessToken,
    generateRefreshToken
} from '../middleware/auth.js';

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Валидация
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Пожалуйста, заполните все обязательные поля'
            });
        }

        // Проверка существующего пользователя
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                error: 'Пользователь с таким email уже существует'
            });
        }

        // Создание пользователя
        const user = await User.create({
            email,
            password,
            name,
            phone
        });

        // Генерация токенов
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Сохраняем refresh токен в базе
        user.refreshToken = refreshToken;
        await user.save();

        // Устанавливаем refresh токен в cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role
            }
        });
        console.log('✅ Регистрация завершена успешно');

    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({
            error: 'Ошибка сервера при регистрации',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация
        if (!email || !password) {
            return res.status(400).json({
                error: 'Введите email и пароль'
            });
        }

        // Поиск пользователя
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        // Проверка пароля
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Неверный email или пароль'
            });
        }

        // Генерация токенов
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Сохраняем refresh токен в базе
        user.refreshToken = refreshToken;
        await user.save();

        // Устанавливаем refresh токен в cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Вход выполнен успешно',
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({
            error: 'Ошибка сервера при входе'
        });
    }
});

// Обновление токена
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh токен отсутствует' });
        }

        // Проверяем refresh токен
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Неверный refresh токен' });
            }

            // Находим пользователя
            const user = await User.findByPk(decoded.id);
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ error: 'Неверный refresh токен' });
            }

            // Генерируем новый access токен
            const newAccessToken = generateAccessToken(user);

            res.json({
                success: true,
                accessToken: newAccessToken
            });
        });
    } catch (error) {
        console.error('Ошибка обновления токена:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Выход
router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Находим пользователя по refresh токену и очищаем его
            const user = await User.findOne({ where: { refreshToken } });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        // Очищаем cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Выход выполнен успешно'
        });

    } catch (error) {
        console.error('Ошибка выхода:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;