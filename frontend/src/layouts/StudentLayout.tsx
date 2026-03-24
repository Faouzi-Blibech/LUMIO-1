import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const StudentLayout: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Lumio
          </h1>
          <p className="text-slate-400 text-xs mt-1">Student Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/student/session"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-slate-700 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
              }`
            }
          >
            Session
          </NavLink>
          <NavLink
            to="/student/homework"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-slate-700 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
              }`
            }
          >
            Homework
          </NavLink>
          <NavLink
            to="/student/progress"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-slate-700 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-blue-400'
              }`
            }
          >
            Progress
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default StudentLayout
