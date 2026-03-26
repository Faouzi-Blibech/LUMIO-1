import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

interface FocusTrendChartProps {
  data: Array<{ date: string; avg_focus: number }>
  height?: number
}

/**
 * FocusTrendChart - Displays focus trends over the last 7 days
 * Uses Recharts LineChart with reference lines for focus thresholds
 */
export const FocusTrendChart: React.FC<FocusTrendChartProps> = ({
  data,
  height = 200,
}) => {
  // Get last 7 data points
  const chartData = useMemo(() => {
    return data.slice(-7)
  }, [data])

  // Map date strings to day abbreviations (Mon, Tue, etc)
  const dayLabels = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ]

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return dayLabels[date.getDay()]
    } catch {
      return dateStr
    }
  }

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: any[]
  }) => {
    if (active && payload && payload.length) {
      const { date, avg_focus } = payload[0].payload
      const percentage = Math.round(avg_focus * 100)
      return (
        <div className="bg-slate-800 text-white rounded px-3 py-2 shadow-lg">
          <p className="text-xs font-semibold">{date}</p>
          <p className="text-sm text-blue-400">Focus: {percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          stroke="#334155"
          strokeDasharray="3 3"
          verticalPoints={[]}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          style={{ fontSize: '0.75rem' }}
        />
        <YAxis
          domain={[0, 1]}
          ticks={[0, 0.35, 0.6, 1.0]}
          hide={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Reference lines for focus thresholds */}
        <ReferenceLine
          y={0.35}
          stroke="#ef4444"
          strokeDasharray="5 5"
          label={{ value: 'Distracted', position: 'right', fill: '#ef4444', fontSize: 12 }}
        />
        <ReferenceLine
          y={0.6}
          stroke="#22c55e"
          strokeDasharray="5 5"
          label={{ value: 'Focused', position: 'right', fill: '#22c55e', fontSize: 12 }}
        />

        {/* Main line */}
        <Line
          type="monotone"
          dataKey="avg_focus"
          stroke="#4F8EF7"
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
