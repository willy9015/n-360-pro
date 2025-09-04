import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Play, Shield, Brain, MapPin, FileCheck, GraduationCap, Users, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const UserManual = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const quickStart = [
    {
      step: 1,
      title: "Registro e Inicio de Sesión",
      description: "Crea tu cuenta usando email/contraseña, reconocimiento facial o comando de voz",
      icon: Shield
    },
    {
      step: 2,
      title: "Configuración de Perfil",
      description: "Completa tu información personal, área de trabajo y certificaciones",
      icon: Users
    },
    {
      step: 3,
      title: "Explorar Dashboard",
      description: "Familiarízate con las funciones principales y el botón de pánico",
      icon: Play
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Predictiva",
      description: "Sistema de inteligencia artificial que analiza patrones y predice riesgos potenciales",
      usage: [
        "Revisa las predicciones diarias al iniciar tu turno",
        "Observa las zonas marcadas como alto riesgo",
        "Reporta cualquier condición no detectada por el sistema"
      ]
    },
    {
      icon: Shield,
      title: "Control EPP",
      description: "Verificación automática del equipo de protección personal usando la cámara",
      usage: [
        "Activa la cámara y enfócate completamente",
        "Asegúrate de tener buena iluminación",
        "Verifica cada elemento mostrado en la lista"
      ]
    },
    {
      icon: MapPin,
      title: "Mapa de Riesgos",
      description: "Visualización en tiempo real de alertas climáticas, sísmicas e industriales",
      usage: [
        "Consulta las alertas antes de cada actividad",
        "Respeta las zonas marcadas en rojo",
        "Reporta nuevos riesgos detectados"
      ]
    },
    {
      icon: FileCheck,
      title: "Auditoría ISO 45001",
      description: "Evaluación automatizada del cumplimiento de normas de seguridad",
      usage: [
        "Genera reportes semanalmente",
        "Revisa las secciones con menor cumplimiento",
        "Implementa las mejoras sugeridas"
      ]
    },
    {
      icon: GraduationCap,
      title: "Capacitación IA",
      description: "Entrenamiento interactivo con simulaciones y reconocimiento de voz",
      usage: [
        "Completa los módulos en orden secuencial",
        "Usa auriculares para mejor experiencia de audio",
        "Practica los procedimientos regularmente"
      ]
    }
  ];

  const emergencyProcedures = [
    {
      type: "Activación de Pánico",
      steps: [
        "Presiona el botón rojo central por 2 segundos",
        "Di 'EMERGENCIA' en voz alta (activación por voz)",
        "Agita el dispositivo vigorosamente (activación por vibración)",
        "Mantén la calma y sigue las instrucciones del sistema"
      ]
    },
    {
      type: "Incidente de Seguridad",
      steps: [
        "Asegura el área y la seguridad personal",
        "Activa la alerta desde el dashboard",
        "Toma fotos del incidente si es seguro hacerlo",
        "Completa el reporte detallado en la app"
      ]
    },
    {
      type: "Falla del Sistema",
      steps: [
        "Verifica tu conexión a internet",
        "Reinicia la aplicación",
        "Usa los procedimientos manuales de respaldo",
        "Reporta el problema al administrador"
      ]
    }
  ];

  const handleDemo = (feature: string) => {
    setActiveDemo(feature);
    setTimeout(() => setActiveDemo(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Manual de Usuario</h1>
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary-glow/10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Guía de Inicio Rápido</h2>
        <div className="space-y-4">
          {quickStart.map((item) => (
            <div key={item.step} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <item.icon className="w-5 h-5 text-primary mt-1" />
            </div>
          ))}
        </div>
      </Card>

      {/* Features Guide */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Guía de Funciones</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`feature-${index}`}>
              <Card>
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">{feature.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Cómo usar:</p>
                    <ul className="space-y-1">
                      {feature.usage.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => handleDemo(feature.title)}
                    disabled={activeDemo === feature.title}
                  >
                    {activeDemo === feature.title ? "Cargando..." : "Ver Demo"}
                  </Button>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Emergency Procedures */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Procedimientos de Emergencia</h2>
        <div className="space-y-3">
          {emergencyProcedures.map((procedure, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-alert" />
                <h3 className="font-medium text-foreground">{procedure.type}</h3>
                <Badge variant="destructive" className="text-xs">CRÍTICO</Badge>
              </div>
              <ol className="space-y-2">
                {procedure.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm text-muted-foreground flex items-start">
                    <span className="w-5 h-5 bg-alert/10 text-alert rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Card className="p-4 bg-gradient-to-br from-muted/50 to-muted">
        <div className="text-center">
          <h3 className="font-semibold text-foreground mb-2">¿Necesitas Ayuda?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contacta a nuestro equipo de soporte técnico
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              Chat en Vivo
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Email Soporte
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserManual;