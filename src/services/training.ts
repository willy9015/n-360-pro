import { supabase } from '@/lib/supabase'
import type { TrainingCourse, UserTraining } from '@/lib/supabase'

export class TrainingService {
  static async getTrainingCourses() {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .order('title')
    
    if (error) throw error
    return data
  }

  static async getUserTrainings(userId: string) {
    const { data, error } = await supabase
      .from('user_trainings')
      .select(`
        *,
        training_courses!user_trainings_course_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async enrollInCourse(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('user_trainings')
      .insert([{
        user_id: userId,
        course_id: courseId,
        status: 'enrolled'
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateTrainingProgress(id: string, updates: Partial<UserTraining>) {
    const { data, error } = await supabase
      .from('user_trainings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async completeTraining(id: string, score?: number) {
    const completionDate = new Date().toISOString()
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 2) // 2 years validity
    
    const updates: Partial<UserTraining> = {
      status: 'completed',
      completion_date: completionDate,
      expiry_date: expiryDate.toISOString(),
      ...(score && { score })
    }

    return this.updateTrainingProgress(id, updates)
  }

  static async getTrainingStats(userId: string) {
    const { data, error } = await supabase
      .from('user_trainings')
      .select('status')
      .eq('user_id', userId)
    
    if (error) throw error

    const stats = {
      total: data.length,
      completed: data.filter(t => t.status === 'completed').length,
      inProgress: data.filter(t => t.status === 'in_progress').length,
      expired: data.filter(t => t.status === 'expired').length
    }

    return stats
  }
}