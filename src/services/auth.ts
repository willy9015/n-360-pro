import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    full_name: string
    role: string
    department: string
  }
}

export class AuthService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    // Fetch user profile
    if (data.user) {
      const profile = await this.getProfile(data.user.id)
      return { ...data, user: { ...data.user, profile } }
    }
    
    return data
  }

  static async signUp(email: string, password: string, fullName: string, role: string, department: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          department
        }
      }
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    
    if (user) {
      const profile = await this.getProfile(user.id)
      return { ...user, profile }
    }
    
    return null
  }

  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateProfile(userId: string, updates: Partial<{ full_name: string; role: string; department: string }>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  // Simulated biometric authentication
  static async authenticateWithBiometrics(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate simulation
        resolve(Math.random() > 0.1)
      }, 1000)
    })
  }

  // Simulated voice authentication
  static async authenticateWithVoice(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 85% success rate simulation
        resolve(Math.random() > 0.15)
      }, 1500)
    })
  }
}