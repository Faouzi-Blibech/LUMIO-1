import React, { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'

interface StudentSubmission {
  id: string
  student_id: string
  student_name: string
  submission_text: string
  grade?: number
  submitted_at: string
}

interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  difficulty: number // 1-5
  submission_count: number
  total_students: number
}

interface ExpandedCard {
  [id: string]: boolean
}

export const TeacherHomeworkPage: React.FC = () => {
  const [classId] = useState('class-001') // Would come from context in production
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [expandedCards, setExpandedCards] = useState<ExpandedCard>({})
  const [gradeInput, setGradeInput] = useState<Record<string, number>>({})
  const [isGrading, setIsGrading] = useState<Record<string, boolean>>({})

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

  // Fetch submissions for an assignment
  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const response = await apiClient.get<{ submissions: StudentSubmission[] }>(
        `/homework/${assignmentId}/submissions`
      )
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: response.data.submissions || []
      }))
    } catch (err) {
      console.error('Fetch submissions error:', err)
    }
  }

  // Toggle card expansion
  const toggleCard = async (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))

    // Fetch submissions when expanding
    if (!expandedCards[id] && !submissions[id]) {
      await fetchSubmissions(id)
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

  // Submit grade
  const handleGradeSubmit = async (submissionId: string) => {
    const grade = gradeInput[submissionId]
    if (grade === undefined || grade < 0 || grade > 10) {
      alert('Grade must be between 0 and 10')
      return
    }

    setIsGrading((prev) => ({
      ...prev,
      [submissionId]: true
    }))

    try {
      await apiClient.patch(`/homework/submissions/${submissionId}/grade`, {
        grade
      })

      // Update local state
      setSubmissions((prev) => {
        const updated = { ...prev }
        for (const key in updated) {
          updated[key] = updated[key].map((sub) =>
            sub.id === submissionId ? { ...sub, grade } : sub
          )
        }
        return updated
      })

      setGradeInput((prev) => {
        const updated = { ...prev }
        delete updated[submissionId]
        return updated
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit grade'
      console.error('Grade submission error:', err)
      alert(errorMsg)
    } finally {
      setIsGrading((prev) => ({
        ...prev,
        [submissionId]: false
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
        <h1 className="text-3xl font-bold text-white">Assignments & Submissions</h1>
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
              <p className="text-slate-400">No assignments created yet</p>
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

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Difficulty:</span>
                        {renderStars(assignment.difficulty)}
                      </div>

                      <div className="text-xs text-slate-400">
                        Due: {formatDate(assignment.due_date)}
                      </div>

                      <div className="text-sm text-blue-400 font-medium">
                        {assignment.submission_count} / {assignment.total_students} submitted
                      </div>
                    </div>
                  </div>

                  <span className="ml-4 text-slate-400">
                    {expandedCards[assignment.id] ? '▼' : '▶'}
                  </span>
                </button>

                {/* Expanded content - submissions list */}
                {expandedCards[assignment.id] && (
                  <div className="border-t border-slate-700 p-4 bg-slate-900/50 space-y-3">
                    {submissions[assignment.id]?.length === 0 ? (
                      <p className="text-slate-400 text-sm">No submissions yet</p>
                    ) : (
                      submissions[assignment.id]?.map((submission) => (
                        <div
                          key={submission.id}
                          className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {submission.student_name}
                              </h4>
                              <p className="text-xs text-slate-400">
                                Submitted:{' '}
                                {new Date(submission.submitted_at).toLocaleString()}
                              </p>
                            </div>

                            {submission.grade !== undefined && submission.grade < 8 && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-900/30 border border-orange-600 text-orange-300">
                                Needs Help
                              </span>
                            )}
                          </div>

                          {/* Submission text */}
                          <div className="mb-3 p-3 bg-slate-900 rounded border border-slate-700 max-h-32 overflow-y-auto">
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">
                              {submission.submission_text}
                            </p>
                          </div>

                          {/* Grade input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={gradeInput[submission.id] ?? submission.grade ?? ''}
                              onChange={(e) =>
                                setGradeInput((prev) => ({
                                  ...prev,
                                  [submission.id]: parseFloat(e.target.value)
                                }))
                              }
                              placeholder="Grade (0-10)"
                              className="w-20 px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleGradeSubmit(submission.id)}
                              disabled={
                                isGrading[submission.id] ||
                                gradeInput[submission.id] === undefined ||
                                gradeInput[submission.id] < 0 ||
                                gradeInput[submission.id] > 10
                              }
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isGrading[submission.id] ? 'Grading...' : 'Grade'}
                            </button>

                            {submission.grade !== undefined && (
                              <span className="text-sm font-semibold text-green-400">
                                Grade: {submission.grade}/10
                              </span>
                            )}
                          </div>
                        </div>
                      ))
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

export default TeacherHomeworkPage
