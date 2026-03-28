import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'teacher' | 'parent'
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, isLoading } = useAuth()

  // Get role from URL params, default to student\n  const urlRole = (searchParams.get('role') || 'student') as 'student' | 'teacher' | 'parent'

  const [formData, setFormData] = useState<RegisterFormData>({\n    name: '',\n    email: '',\n    password: '',\n    confirmPassword: '',\n    role: urlRole\n  })\n  const [errors, setErrors] = useState<FormErrors>({})\n  const [generalError, setGeneralError] = useState<string>('')
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle')

  useEffect(() => {\n    setFormData(prev => ({ ...prev, role: urlRole }))  }, [urlRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const { name, value } = e.target\n    setFormData(prev => ({\n      ...prev,\n      [name]: value\n    }))\n    if (errors[name as keyof FormErrors]) {\n      setErrors(prev => ({\n        ...prev,\n        [name]: undefined\n      }))\n    }\n    if (generalError) setGeneralError('')\n  }

  const validateForm = (): boolean => {\n    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {\n      newErrors.name = 'Full name is required'\n    } else if (formData.name.trim().length < 2) {\n      newErrors.name = 'Name must be at least 2 characters'\n    }

    if (!formData.email.trim()) {\n      newErrors.email = 'Email is required'\n    } else {\n      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/\n      if (!emailRegex.test(formData.email)) {\n        newErrors.email = 'Please enter a valid email address'\n      }\n    }

    if (!formData.password) {\n      newErrors.password = 'Password is required'\n    } else if (formData.password.length < 6) {\n      newErrors.password = 'Password must be at least 6 characters'\n    }

    if (!formData.confirmPassword) {\n      newErrors.confirmPassword = 'Please confirm your password'\n    } else if (formData.password !== formData.confirmPassword) {\n      newErrors.confirmPassword = 'Passwords do not match'\n    }

    setErrors(newErrors)\n    return Object.keys(newErrors).length === 0\n  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {\n    e.preventDefault()\n    setGeneralError('')
    setLoadingState('loading')

    if (!validateForm()) {\n      setLoadingState('idle')\n      return\n    }

    try {\n      await register(formData.name, formData.email, formData.password, formData.role)

      const roleRoute: Record<string, string> = {\n        student: '/student/session',\n        teacher: '/teacher/dashboard',\n        parent: '/parent/overview'\n      }

      navigate(roleRoute[formData.role])\n    } catch (err) {\n      if (err instanceof Error) {\n        setGeneralError(err.message || 'Registration failed. Please try again.')\n      } else {\n        setGeneralError('An unexpected error occurred. Please try again.')\n      }\n      setLoadingState('idle')\n    }\n  }

  const roleName = {\n    student: 'Student',\n    teacher: 'Teacher',\n    parent: 'Parent'\n  }[formData.role]

  return (\n    <div className=\"min-h-screen bg-bg flex items-center justify-center px-6 py-12\">\n      <div className=\"w-full max-w-md\">\n        {/* Header */}\n        <div className=\"text-center mb-12\">\n          <h1 className=\"text-xl font-display font-bold text-ink mb-2\" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>\n            LUMIO\n          </h1>\n          <p className=\"text-sm text-muted font-mono\" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>\n            — Create Account\n          </p>\n        </div>

        {/* Form Card */}\n        <div className=\"bg-surface border border-border p-12 mb-8\">\n          {/* General Error Message */}\n          {generalError && (\n            <div className=\"mb-8 p-4 bg-red-50 border-[1.5px] border-red-600\">\n              <p className=\"text-red-600 text-sm font-mono\">{generalError}</p>\n            </div>\n          )}

          <form onSubmit={handleSubmit} className=\"space-y-6\">\n            {/* Full Name Field */}\n            <div>\n              <label htmlFor=\"name\" className=\"form-label\">\n                Full Name\n              </label>\n              <input\n                type=\"text\"\n                id=\"name\"\n                name=\"name\"\n                value={formData.name}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"John Doe\"\n                className={`input-field ${\n                  errors.name ? 'border-red-600' : ''\n                }`}\n              />\n              {errors.name && (\n                <p className=\"text-red-600 text-xs mt-2 font-mono\">{errors.name}</p>\n              )}\n            </div>

            {/* Email Field */}\n            <div>\n              <label htmlFor=\"email\" className=\"form-label\">\n                Email\n              </label>\n              <input\n                type=\"email\"\n                id=\"email\"\n                name=\"email\"\n                value={formData.email}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"name@example.com\"\n                className={`input-field ${\n                  errors.email ? 'border-red-600' : ''\n                }`}\n              />\n              {errors.email && (\n                <p className=\"text-red-600 text-xs mt-2 font-mono\">{errors.email}</p>\n              )}\n            </div>

            {/* Password Field */}\n            <div>\n              <label htmlFor=\"password\" className=\"form-label\">\n                Password\n              </label>\n              <input\n                type=\"password\"\n                id=\"password\"\n                name=\"password\"\n                value={formData.password}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"••••••••\"\n                className={`input-field ${\n                  errors.password ? 'border-red-600' : ''\n                }`}\n              />\n              {errors.password && (\n                <p className=\"text-red-600 text-xs mt-2 font-mono\">{errors.password}</p>\n              )}\n            </div>

            {/* Confirm Password Field */}\n            <div>\n              <label htmlFor=\"confirmPassword\" className=\"form-label\">\n                Confirm Password\n              </label>\n              <input\n                type=\"password\"\n                id=\"confirmPassword\"\n                name=\"confirmPassword\"\n                value={formData.confirmPassword}\n                onChange={handleInputChange}\n                disabled={loadingState === 'loading'}\n                placeholder=\"••••••••\"\n                className={`input-field ${\n                  errors.confirmPassword ? 'border-red-600' : ''\n                }`}\n              />\n              {errors.confirmPassword && (\n                <p className=\"text-red-600 text-xs mt-2 font-mono\">{errors.confirmPassword}</p>\n              )}\n            </div>

            {/* Create Account Button */}\n            <button\n              type=\"submit\"\n              disabled={loadingState === 'loading'}\n              className=\"btn-accent w-full\"\n            >\n              {loadingState === 'loading' ? 'Creating account...' : 'Create Account'}\n            </button>\n          </form>

          {/* Login Link */}\n          <p className=\"text-center text-muted text-sm font-mono mt-8\" style={{ letterSpacing: '0.02em' }}>\n            Already registered?{' '}\n            <a\n              href={`/login?role=${formData.role}`}\n              className=\"text-accent hover:underline font-bold transition-colors\"\n            >\n              Sign In\n            </a>\n          </p>\n        </div>

        {/* Footer */}\n        <div className=\"text-center text-muted text-xs font-mono\" style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>\n          <p>© 2026 Lumio — by Unblur</p>\n        </div>\n      </div>\n    </div>\n  )\n}

export default RegisterPage