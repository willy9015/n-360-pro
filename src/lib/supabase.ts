import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  role: string
  department: string
  created_at: string
  updated_at: string
}

export interface Incident {
  id: string
  user_id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  location: string
  created_at: string
  updated_at: string
}

export interface TrainingCourse {
  id: string
  title: string
  description: string
  duration_hours: number
  is_mandatory: boolean
  created_at: string
  updated_at: string
}

export interface UserTraining {
  id: string
  user_id: string
  course_id: string
  status: 'enrolled' | 'in_progress' | 'completed' | 'expired'
  completion_date?: string
  expiry_date?: string
  score?: number
  created_at: string
}

export interface PPEInspection {
  id: string
  user_id: string
  equipment_type: string
  equipment_id: string
  inspection_date: string
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  notes?: string
  next_inspection: string
  created_at: string
}

export interface RiskAssessment {
  id: string
  user_id: string
  area: string
  risk_type: string
  description: string
  probability: number
  severity: number
  risk_score: number
  mitigation_measures: string
  status: 'identified' | 'mitigating' | 'controlled' | 'closed'
  created_at: string
  updated_at: string
}