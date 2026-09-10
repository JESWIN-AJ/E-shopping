// src/App.tsx
import {    Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Cart from '@/pages/cart/cart'
import Landing from '@/pages/landing/landing'
import Products from '@/pages/products/products'
import Login from '@/pages/login/login'
import Signup from '@/pages/signup/signup'
import Checkout from '@/pages/checkout/checkout'
import Orders from '@/pages/orders/order'
import { PageLayout } from './components/layout/PageLayout/PageLayout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return !user ? <>{children}</> : <Navigate to="/" replace />
}



export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        
        {/* All other routes are protected */}
        <Route element={<PageLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}