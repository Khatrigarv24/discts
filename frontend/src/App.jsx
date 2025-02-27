import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import InventoryPage from './pages/InventoryPage'
import AboutPage from './pages/AboutPage'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App