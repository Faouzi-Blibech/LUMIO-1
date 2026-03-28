import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface LoginFormData {
  email: string
  password: string
  role: 'student' | 'teacher' | 'parent'
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isLoading } = useAuth()
  
  // Get role from URL params, default to student
  const urlRole = (searchParams.get('role') || 'student') as 'student' | 'teacher' | 'parent'

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: urlRole
  })
  
  const [error, setError] = useState<string>('')
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle')

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: urlRole }))
  }, [urlRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoadingState('loading')

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoadingState('idle')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address')
        setLoadingState('idle')
        return
      }

      await login(formData.email, formData.password, formData.role)

      const roleRoutes: Record<string, string> = {\n        student: '/student/session',\n        teacher: '/teacher/dashboard',\n        parent: '/parent/overview'\n      }\n\n      navigate(roleRoutes[formData.role])\n    } catch (err) {\n      if (err instanceof Error) {\n        const errorMessage = err.message\n        if (errorMessage.includes('401')) {\n          setError('Invalid email or password')\n        } else if (errorMessage.includes('403')) {\n          setError('Wrong role selected')\n        } else if (\n          errorMessage.includes('ECONNREFUSED') ||\n          errorMessage.includes('Network') ||\n          errorMessage.includes('cannot connect')\n        ) {\n          setError('Cannot reach server — check your connection')\n        } else {\n          setError(errorMessage || 'Login failed. Please try again.')\n        }\n      } else if (err instanceof TypeError && err.message.includes('fetch')) {\n        setError('Cannot reach server — check your connection')\n      } else {\n        setError('An unexpected error occurred. Please try again.')\n      }\n      setLoadingState('idle')\n    }\n  }\n\n  const roleName = {\n    student: 'Student',\n    teacher: 'Teacher',\n    parent: 'Parent'\n  }[formData.role]\n\n  return (\n    <div className=\"min-h-screen bg-bg flex items-center justify-center px-6 py-12\">\n      <div className=\"w-full max-w-md\">\n        {/* Header */}\n        <div className=\"text-center mb-12\">\n          <h1 className=\"text-xl font-display font-bold text-ink mb-2\" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>\n            LUMIO\n          </h1>\n          <p className=\"text-sm text-muted font-mono\" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>\n            — Welcome back, {roleName.toLowerCase()}\n          </p>\n        </div>\n\n        {/* Form Card */}\n        <div className=\"bg-surface border border-border p-12 mb-8\">\n          {/* Error Message */}\n          {error && (\n            <div className=\"mb-8 p-4 bg-red-50 border-[1.5px] border-red-600\">\n              <p className=\"text-red-600 text-sm font-mono\">{error}</p>\n            </div>\n          )}\n\n          <form onSubmit={handleSubmit} className=\"space-y-6\">\n            {/* Email Field */}\n            <div>\n              <label htmlFor=\"email\" className=\"form-label\">\n                Email\n              </label>\n              <input\n                type=\"email\"\n                id=\"email\"\n                name=\"email\"\n                value={formData.email}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"name@example.com\"\n                className=\"input-field\"\n              />\n            </div>\n\n            {/* Password Field */}\n            <div>\n              <label htmlFor=\"password\" className=\"form-label\">\n                Password\n              </label>\n              <input\n                type=\"password\"\n                id=\"password\"\n                name=\"password\"\n                value={formData.password}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"••••••••\"\n                className=\"input-field\"\n              />\n            </div>\n\n            {/* Sign In Button */}\n            <button\n              type=\"submit\"\n              disabled={loadingState === 'loading'}\n              className=\"btn-accent w-full\"\n            >\n              {loadingState === 'loading' ? 'Signing in...' : 'Sign In'}\n            </button>\n          </form>\n\n          {/* Register Link */}\n          <p className=\"text-center text-muted text-sm font-mono mt-8\" style={{ letterSpacing: '0.02em' }}>\n            New here?{' '}\n            <a\n              href={`/register?role=${formData.role}`}\n              className=\"text-accent hover:underline font-bold transition-colors\"\n            >\n              Create an account\n            </a>\n          </p>\n        </div>\n\n        {/* Footer */}\n        <div className=\"text-center text-muted text-xs font-mono\" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>\n          <p>© 2026 Lumio — by Unblur</p>\n        </div>\n      </div>\n    </div>\n  )\n}\n\nexport default LoginPage
