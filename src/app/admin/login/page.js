// ========================================
// ADMIN LOGIN PAGE
// Authentication page for admin access
// ========================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }
      
      if (data.success) {
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login gagal');
      }
      
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-5xl">⚽</span>
            <span className="text-accent-red text-3xl font-bold">TitikBola</span>
          </div>
          <p className="text-admin-text-muted">Admin Panel</p>
        </div>
        
        {/* Login form */}
        <div className="bg-admin-sidebar rounded-lg shadow-lg p-8 border border-admin-card">
          <h1 className="text-2xl font-bold text-admin-text mb-6">Login</h1>
          
          {error && (
            <div className="bg-admin-danger/10 border border-admin-danger text-admin-danger px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-admin-text text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-admin-bg border border-admin-card rounded-lg text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-accent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-admin-text text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-admin-bg border border-admin-card rounded-lg text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-accent"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-admin-accent hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-admin-text-muted hover:text-admin-text text-sm">
              ← Back to Homepage
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-admin-text-muted text-sm mt-6">
          © 2025 TitikBola. All rights reserved.
        </p>
      </div>
    </div>
  );
}