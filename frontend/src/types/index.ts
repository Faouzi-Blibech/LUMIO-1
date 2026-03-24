/**
 * Lumio Type Definitions
 * Shared interfaces for the ADHD learning support platform
 */

/**
 * User role types
 */
export type UserRole = 'student' | 'teacher' | 'parent'

/**
 * User interface - represents a platform user
 */
export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Focus tracking payload from gaze and attention tracking
 * Contains biometric data for focus analysis
 */
export interface FocusPayload {
  gaze_x: number
  gaze_y: number
  blink_rate: number
  head_pose_deg: number
  focus_score: number
  ts: number
}

/**
 * Focus session data for analytics
 */
export interface FocusSession {
  id: string
  userId: string
  startTime: number
  endTime: number
  focusPayloads: FocusPayload[]
  averageFocusScore: number
  distractionCount: number
  taskId?: string
}

/**
 * Student-specific data
 */
export interface StudentProfile extends User {
  role: 'student'
  gradeLevel?: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Teacher-specific data
 */
export interface TeacherProfile extends User {
  role: 'teacher'
  schoolName?: string
  subject?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Parent-specific data
 */
export interface ParentProfile extends User {
  role: 'parent'
  childrenIds?: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Learning task for students
 */
export interface LearningTask {
  id: string
  title: string
  description: string
  durationMinutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  createdBy: string
  createdAt: Date
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
  errors?: Record<string, string>
}

/**
 * Authentication token payload
 */
export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  iat: number
  exp: number
}
