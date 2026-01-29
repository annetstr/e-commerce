import { AuthProvider } from './components/auth/AuthContext';
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
// import CartPage from './pages/CartPage'
import './App.css'
import Category from './pages/Category'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/Login'
import Register from './pages/Register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile_page" element={<ProfilePage />} />
        {/* <Route path="/profile_page" element={<ProfilePage />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* <Route path="cart" element={<CartPage />} /> */}
      </Routes>
    </AuthProvider>
  )
}

export default App