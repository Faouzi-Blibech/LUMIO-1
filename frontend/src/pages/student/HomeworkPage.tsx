import React, { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'

interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  difficulty: number // 1-5
  status: 'submitted' | 'pending' | 'overdue'
}

interface ExpandedCard {
  [id: string]: boolean
}

export const StudentHomeworkPage: React.FC = () => {
  const [classId] = useState('class-001') // Would come from context in production
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [expandedCards, setExpandedCards] = useState<ExpandedCard>({})
  const [submissionText, setSubmissionText] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({})

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<{ assignments: Assignment[] }>(
          `/homework/${classId}`
        )
        setAssignments(response.data.assignments || [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load assignments'
        setError(errorMsg)
        console.error('Fetch assignments error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [classId])

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-900/30 border-green-600 text-green-300'
      case 'pending':
        return 'bg-amber-900/30 border-amber-600 text-amber-300'
      case 'overdue':
        return 'bg-red-900/30 border-red-600 text-red-300'
      default:
        return 'bg-slate-700 border-slate-600 text-slate-300'
    }
  }

  // Format due date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Render difficulty stars
  const renderStars = (difficulty: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < difficulty ? 'text-yellow-400' : 'text-slate-600'}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  // Submit assignment
  const handleSubmit = async (assignmentId: string) => {
    const text = submissionText[assignmentId]?.trim()
    if (!text) return

    setIsSubmitting((prev) => ({
      ...prev,
      [assignmentId]: true
    }))

    try {
      await apiClient.post(`/homework/${assignmentId}/submit`, {
        text_submission: text
      })

      // Update local state
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, status: 'submitted' as const } : a
        )
      )

      setSubmissionText((prev) => ({
        ...prev,
        [assignmentId]: ''
      }))

      setExpandedCards((prev) => ({
        ...prev,
        [assignmentId]: false
      }))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit assignment'
      console.error('Submit error:', err)
      alert(errorMsg)
    } finally {
      setIsSubmitting((prev) => ({
        ...prev,
        [assignmentId]: false
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-slate-400">Loading assignments...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur px-6 py-4">
        <h1 className="text-3xl font-bold text-white">My Assignments</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-900/30 border border-red-600">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <p className="text-2xl text-slate-400 mb-2">📝</p>
              <p className="text-slate-400">No assignments yet</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition"
              >
                {/* Card header */}
                <button
                  onClick={() => toggleCard(assignment.id)}
                  className="w-full p-4 flex items-start justify-between hover:bg-slate-700/50 transition"
                >
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white mb-2">{assignment.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{assignment.description}</p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Difficulty:</span>
                        {renderStars(assignment.difficulty)}
                      </div>

                      <div className="text-xs text-slate-400">
                        Due: {formatDate(assignment.due_date)}
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(assignment.status)}`}
                      >
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <span className="ml-4 text-slate-400">
                    {expandedCards[assignment.id] ? '▼' : '▶'}
                  </span>
                </button>

                {/* Expanded content */}
                {expandedCards[assignment.id] && (
                  <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                    {assignment.status === 'submitted' ? (
                      <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
                        <p className="text-sm text-green-300">✓ Already submitted</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={submissionText[assignment.id] || ''}
                          onChange={(e) =>
                            setSubmissionText((prev) => ({
                              ...prev,
                              [assignment.id]: e.target.value
                            }))
                          }
                          placeholder="Write your assignment here..."
                          className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={6}
                        />

                        <button
                          onClick={() => handleSubmit(assignment.id)}
                          disabled={
                            isSubmitting[assignment.id] ||
                            !submissionText[assignment.id]?.trim()
                          }
                          className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting[assignment.id] ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentHomeworkPage
