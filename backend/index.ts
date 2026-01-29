import express from 'express';
import cors from 'cors'
import { url } from 'node:inspector';
import productsData from '../public/db.json' with { type: 'json' };
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { authenticateToken } from './middleware/auth.js';

const app = express()
const PORT = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateToken, userRoutes);


// Моковые данные

const products = Array.isArray(productsData) ? productsData : productsData.products;
// const products = [
//     { id: 1, name: 'Ноутбук', price: 999, category: 'electronics', img: '../public/db/2147875657.jpg', description: 'Мощный ультрабук с экраном 15.6" для работы и творчества' },
//     {
//         id: 2, name: 'Смартфон', price: 499, category: 'electronics', img: '../public/db/1d4b1beb8df820330f6ca9c722831304.jpg', description: 'Инновационный смартфон с искусственным интеллектом в камере. Основная камера 108 МП, оптическая стабилизация, ночной режим. Аккумулятор на 5000 мАч с беспроводной зарядкой 50 Вт.'
//     },
//     {
//         id: 3, name: 'Книга', price: 29, category: 'books', img: '../public/db/70015834_JEMA GER 1639-10.jpg', description: 'Захватывающий детектив с неожиданной развязкой. Роман- бестселлер, переведенный на 30 языков мира.'
//     },
// ]


app.get('/api/products', (req: express.Request, res: express.Response) => {
    res.json(products)
})

app.get('/api/products/:id', (req: express.Request, res: express.Response) => {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
    }
    const product = products.find(p => p.id === parseInt(idParam))
    product ? res.json(product) : res.status(404).json({ error: 'Not found' })
})

app.get('/api/categories', (req: express.Request, res: express.Response) => {
    // Извлекаем уникальные категории из товаров
    const categories = [...new Set(products.map(p => p.category))];

    res.json({
        success: true,
        categories: categories,
        count: categories.length
    });
});

app.get('/api/products/category/:category', (req: express.Request, res: express.Response) => {
    const category_cat = req.params.category;

    if (Array.isArray(category_cat)) {
        return res.status(400).json({
            error: 'Category parameter should be a single value, not an array'
        });
    }

    // Проверяем что category не undefined
    if (!category_cat) {
        return res.status(400).json({ error: 'Category parameter is required' });
    }

    const filteredProducts = products.filter(p =>
        p.category.toLowerCase() === category_cat.toLowerCase()
    );

    res.json({
        success: true,
        category: category_cat,
        products: filteredProducts,
        count: filteredProducts.length
    });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Доступен по адресу: http://localhost:${PORT}`);
    console.log(`📦 API товаров: http://localhost:${PORT}/api/products`);
})