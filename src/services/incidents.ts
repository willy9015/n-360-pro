import { supabase } from '@/lib/supabase'
import type { Incident } from '@/lib/supabase'

export class IncidentService {
  static async getIncidents() {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        profiles!incidents_user_id_fkey(full_name, role, department)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getIncidentById(id: string) {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        profiles!incidents_user_id_fkey(full_name, role, department)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createIncident(incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('incidents')
      .insert([incident])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateIncident(id: string, updates: Partial<Incident>) {
    const { data, error } = await supabase
      .from('incidents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteIncident(id: string) {
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async getIncidentsByUser(userId: string) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}