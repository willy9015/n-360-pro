import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Lock, 
  Scan, 
  Mic, 
  Shield,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import guardian360Logo from '@/assets/guardian360-logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, authenticateWithBiometrics, authenticateWithVoice } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return;
    
    setIsSubmitting(true);
    try {
      await signIn(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsSubmitting(true);
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceLogin = async () => {
    setIsSubmitting(true);
    try {
      const success = await authenticateWithVoice();
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-corporate">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img 
            src={guardian360Logo} 
            alt="Guardián360" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">Guardián360</h1>
          <p className="text-sm text-muted-foreground">Seguridad Industrial Inteligente</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 bg-background border-border focus:border-primary"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10 bg-background border-border focus:border-primary"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary-glow text-primary-foreground font-semibold"
            disabled={isSubmitting || !credentials.email || !credentials.password}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <Separator className="mb-6" />

        {/* Alternative Login Methods */}
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Métodos alternativos de acceso
          </p>

          <Button
            variant="outline"
            onClick={handleBiometricLogin}
            className="w-full border-secondary text-secondary-foreground hover:bg-secondary/10"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Scan className="w-4 h-4 mr-2" />
            )}
            Reconocimiento Facial
          </Button>

          <Button
            variant="outline"
            onClick={handleVoiceLogin}
            className="w-full border-secondary text-secondary-foreground hover:bg-secondary/10"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            Acceso por Voz
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Sistema de Seguridad Industrial v2.1.0
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;