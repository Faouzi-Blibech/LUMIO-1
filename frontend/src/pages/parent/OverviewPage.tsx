import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { FocusTrendChart } from '../../components/FocusTrendChart'

interface ProfileData {
  name: string
  risk_tier: 'low' | 'moderate' | 'needs_attention'
  for_student: string[]
  for_parent: string[]
  focus_avg_7d: number
  focus_history: Array<{ date: string; avg_focus: number }>
  homework: Array<{
    title: string
    status: 'pending' | 'submitted' | 'graded'
  }>
}

/**
 * OverviewPage - Parent dashboard showing child's learning overview
 * Displays risk tier, focus trends, suggestions, and homework status
 */
const OverviewPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        if (!childId) {
          setError('Child ID not found')
          return
        }
        const response = await apiClient.get<ProfileData>(
          `/students/${childId}/profile`
        )
        setProfile(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [childId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-400">{error || 'No profile data available'}</p>
      </div>
    )
  }

  // Risk tier styling
  const riskConfig = {
    low: {
      badge: 'bg-green-900 text-green-200',
      label: 'Doing well',
    },
    moderate: {
      badge: 'bg-amber-900 text-amber-200',
      label: 'Monitor',
    },
    needs_attention: {
      badge: 'bg-red-900 text-red-200',
      label: 'Needs support',
    },
  }

  const riskStyle = riskConfig[profile.risk_tier]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
        <p className="text-slate-400 text-lg">
          Your child's learning overview
        </p>
      </div>

      {/* Risk tier badge */}
      <div className="flex items-center gap-3">
        <div className={`px-4 py-2 rounded-lg font-semibold ${riskStyle.badge}`}>
          {riskStyle.label}
        </div>
        <p className="text-slate-400 text-sm">
          Focus this week: {Math.round(profile.focus_avg_7d * 100)}%
        </p>
      </div>

      {/* Focus trend chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          Focus Trends (Last 7 Days)
        </h2>
        <FocusTrendChart data={profile.focus_history} height={250} />
      </div>

      {/* Suggestions section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Helpful tips for home
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.for_parent.map((suggestion, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex gap-3"
            >
              <div className="text-yellow-400 text-xl flex-shrink-0">💡</div>
              <p className="text-slate-200 text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Homework completion */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Assignments</h2>
        <div className="space-y-2">
          {profile.homework.length > 0 ? (
            profile.homework.map((hw, idx) => (
              <div
                key={idx}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-between"
              >
                <p className="text-slate-200">{hw.title}</p>
                <div className="flex gap-2">
                  {hw.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                      Pending
                    </span>
                  )}
                  {hw.status === 'submitted' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200">
                      Submitted
                    </span>
                  )}
                  {hw.status === 'graded' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-200">
                      Graded
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No assignments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverviewPage
