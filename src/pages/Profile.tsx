import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Award, 
  Calendar, 
  Shield, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const profileStats = [
    { icon: Award, label: 'Capacitaciones', value: '12', color: 'text-green-600' },
    { icon: Calendar, label: 'Días Activos', value: '45', color: 'text-blue-600' },
    { icon: Shield, label: 'Sin Incidentes', value: '24', color: 'text-primary' },
    { icon: FileText, label: 'Reportes', value: '8', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-primary-foreground">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Juan Carlos Pérez</h1>
            <p className="text-primary-foreground/80">Supervisor de Seguridad</p>
            <p className="text-primary-foreground/80 text-sm">ID: GU360-001</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Capacitación EPP completada</span>
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Inspección de seguridad</span>
              <span className="text-xs text-muted-foreground">Ayer</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Reporte de riesgos enviado</span>
              <span className="text-xs text-muted-foreground">2 días</span>
            </div>
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Certificaciones</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground">ISO 45001 Auditor</span>
              </div>
              <span className="text-xs text-green-600">Vigente</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-foreground">Primeros Auxilios</span>
              </div>
              <span className="text-xs text-blue-600">Vigente</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-foreground">Manejo de Crisis</span>
              </div>
              <span className="text-xs text-orange-600">Próximo a vencer</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuraciones
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-alert hover:text-alert"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;