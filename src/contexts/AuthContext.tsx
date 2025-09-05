import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService, type AuthUser } from '@/services/auth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role: string, department: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  authenticateWithBiometrics: () => Promise<boolean>
  authenticateWithVoice: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const currentUser = await AuthService.getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      await AuthService.signIn(email, password)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a Guardián360"
      })
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales inválidas",
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string, department: string) => {
    try {
      setLoading(true)
      await AuthService.signUp(email, password, fullName, role, department)
      toast({
        title: "Registro exitoso",
        description: "Revisa tu email para verificar tu cuenta"
      })
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive"
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email)
      toast({
        title: "Email enviado",
        description: "Revisa tu email para restablecer tu contraseña"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    const success = await AuthService.authenticateWithBiometrics()
    if (success) {
      // For demo, use a default user
      await signIn("demo@guardian360.com", "demo123")
    } else {
      toast({
        title: "Autenticación fallida",
        description: "No se pudo verificar la identidad biométrica",
        variant: "destructive"
      })
    }
    return success
  }

  const authenticateWithVoice = async (): Promise<boolean> => {
    const success = await AuthService.authenticateWithVoice()
    if (success) {
      // For demo, use a default user
      await signIn("demo@guardian360.com", "demo123")
    } else {
      toast({
        title: "Autenticación fallida",
        description: "No se pudo verificar la identidad por voz",
        variant: "destructive"
      })
    }
    return success
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    authenticateWithBiometrics,
    authenticateWithVoice
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}