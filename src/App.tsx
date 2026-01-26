import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
// import CartPage from './pages/CartPage'
// import ProfilePage from './pages/ProfilePage'
import './App.css'
import Category from './pages/Category'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      {/* <Route path="/" element={<Layout />}> */}
      <Route index element={<HomePage />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/product/:id" element={<ProductPage />} />
      {/* <Route path="cart" element={<CartPage />} />
        <Route path="profile" element={<ProfilePage />} /> */}
      {/* </Route> */}
    </Routes>
  )
}

export default App