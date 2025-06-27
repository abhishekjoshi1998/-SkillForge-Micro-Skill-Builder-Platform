import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from './pages/CourseDetailPage';
import DashboardPage from './pages/DashboardPage';
import CreateCoursePage from './pages/CreateCoursePage';

function App() {
 

  return (
    <div>
      {/* <h1 className='text-[50px]'>Hello world</h1> */}
      <Routes>
            <Route path="/" element={<Layout />}>
      
        
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="course/:id" element={<CourseDetailPage />} />
      
          
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="create-course" element={<CreateCoursePage />} />
              </Route>
      
             
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                  <p className="mt-4">The page you are looking for does not exist.</p>
                </div>
              } />
      
            </Route>
          </Routes>
      
    </div>
  )
}

export default App
