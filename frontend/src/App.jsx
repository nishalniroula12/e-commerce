import React from 'react'
import Navbar from './component/Navbar.jsx'
import { Routes,Route  } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Product from './pages/Product.jsx'

const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path="/category" element={<Category/>}/>
            <Route path="/product" element={<Product/>}/>
          
            
        </Routes>

      
    </div>
  )
}

export default App
