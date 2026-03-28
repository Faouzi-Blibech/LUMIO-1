import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useCustomCursor } from './hooks/useCustomCursor'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentLayout from './pages/student/StudentLayout'
import TeacherLayout from './pages/teacher/TeacherLayout'
import ParentLayout from './pages/parent/ParentLayout'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  useCustomCursor()

  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute role="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute role="parent">
                <ParentLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
