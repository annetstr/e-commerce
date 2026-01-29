import express from 'express';
import User from '../model/Users.js';

const router = express.Router();

// Получение профиля
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление профиля
router.put('/profile', async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Обновляем только переданные поля
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            message: 'Профиль успешно обновлен',
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
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Смена пароля
router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Заполните все поля'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Пароль должен быть не менее 6 символов'
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        // Проверка текущего пароля
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(400).json({ error: 'Текущий пароль неверен' });
        }

        // Обновление пароля
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Пароль успешно изменен'
        });

    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;