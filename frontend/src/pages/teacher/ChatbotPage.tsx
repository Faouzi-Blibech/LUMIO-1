import React, { useState, useEffect, useMemo, useRef } from 'react'
import { apiClient } from '../../lib/api'
import ChatInterface from '../../components/ChatInterface'

interface Student {
  id: string
  name: string
  risk_tier?: 'low' | 'moderate' | 'needs_attention'
}

export const ChatbotPage: React.FC = () => {
  const selectedClassId = 'class-001'
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined)
  const [students, setStudents] = useState<Student[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const fillInputRef = useRef<((text: string) => void) | null>(null)

  // Suggested questions
  const suggestedQuestions = useMemo(
    () => [
      'What should I do for a distracted student?',
      'How can I support a fatigued learner?',
      'What breaks do you recommend for long sessions?'
    ],
    []
  )

  // Fetch students for selected class
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get<{ students: Student[] }>(
          `/classes/${selectedClassId}/students`
        )
        setStudents(response.data.students || [])
        setSelectedStudentId(undefined)
      } catch (error) {
        console.error('Failed to fetch students:', error)
        setStudents([])
      }
    }

    fetchStudents()
  }, [selectedClassId])

  // Get selected student info
  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId]
  )

  // Get risk tier color
  const getRiskTierColor = (tier?: string) => {
    switch (tier) {
      case 'low':
        return 'bg-green-900/30 border-green-600 text-green-300'
      case 'moderate':
        return 'bg-amber-900/30 border-amber-600 text-amber-300'
      case 'needs_attention':
        return 'bg-red-900/30 border-red-600 text-red-300'
      default:
        return 'bg-slate-700 border-slate-600 text-slate-300'
    }
  }

  // Fill input with suggestion
  const fillSuggestion = (suggestion: string) => {
    if (fillInputRef.current) {
      fillInputRef.current(suggestion)
    }
  }

  // Register the fill callback
  const handleSuggestFill = (callback: (text: string) => void) => {
    ;(fillInputRef as React.MutableRefObject<(text: string) => void | null>).current = callback
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur px-6 py-4">
        <h1 className="text-3xl font-bold text-white mb-4">AI Teaching Assistant</h1>

        {/* Student context selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-300">Student Context:</label>
          <select
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(e.target.value || undefined)}
            className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No student context</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          {/* Student info card */}
          {selectedStudent && (
            <div
              className={`px-3 py-2 rounded-lg border text-sm font-medium ${getRiskTierColor(selectedStudent.risk_tier)}`}
            >
              {selectedStudent.name} •{' '}
              {selectedStudent.risk_tier === 'low'
                ? 'Low Risk'
                : selectedStudent.risk_tier === 'moderate'
                  ? 'Moderate Risk'
                  : 'Needs Attention'}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Chat interface */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-800 rounded-xl overflow-hidden">
          <ChatInterface
            endpoint="/rag/teacher"
            studentId={selectedStudentId}
            onSuggestFill={handleSuggestFill}
          />
        </div>

        {/* Sidebar with suggestions */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 overflow-hidden`}
        >
          <div className="bg-slate-800 rounded-xl p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Suggestions</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => fillSuggestion(question)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle sidebar button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
          >
            ◀
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatbotPage
