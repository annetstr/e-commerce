import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email || !password) {
            setFormError('Заполните все поля');
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setFormError(result.error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <h2>Вход в личный кабинет</h2>

                {(error || formError) && (
                    <div className="error-message">
                        {error || formError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="links">
                    <Link to="/register">Еще нет аккаунта? Зарегистрируйтесь</Link>
                    {/* <Link to="/forgot-password">Забыли пароль?</Link> */}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;