import React, { useState } from 'react';
import { ArrowLeft, FileCheck, Download, Play, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const ISOAudit = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const auditSections = [
    { section: "4. Contexto de la organización", compliance: 95, status: "complete" },
    { section: "5. Liderazgo y participación", compliance: 88, status: "complete" },
    { section: "6. Planificación", compliance: 92, status: "complete" },
    { section: "7. Apoyo", compliance: 85, status: "in-progress" },
    { section: "8. Operación", compliance: 78, status: "in-progress" },
    { section: "9. Evaluación del desempeño", compliance: 65, status: "pending" },
    { section: "10. Mejora", compliance: 45, status: "pending" }
  ];

  const recentReports = [
    { date: "15 Nov 2024", compliance: 87, findings: 12, status: "Completado" },
    { date: "01 Nov 2024", compliance: 84, findings: 15, status: "Completado" },
    { date: "15 Oct 2024", compliance: 81, findings: 18, status: "Completado" }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-500';
      case 'in-progress':
        return 'text-yellow-500';
      case 'pending':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <FileCheck className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Auditoría ISO 45001</h1>
        </div>
      </div>

      {/* Overall Compliance */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary-glow/10">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">78%</h2>
          <p className="text-sm text-muted-foreground">Cumplimiento General</p>
        </div>
        <Progress value={78} className="mb-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progreso actual</span>
          <span>Meta: 95%</span>
        </div>
      </Card>

      {/* Generate Report Button */}
      <div className="mb-6">
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-primary to-primary-glow"
        >
          <Play className="w-4 h-4 mr-2" />
          {isGenerating ? "Generando Reporte..." : "Generar Reporte Automatizado"}
        </Button>
      </div>

      {/* Audit Sections */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Secciones de Auditoría</h2>
        <div className="space-y-3">
          {auditSections.map((section, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{section.section}</span>
                <CheckCircle className={`w-4 h-4 ${getStatusColor(section.status)}`} />
              </div>
              <div className="space-y-2">
                <Progress value={section.compliance} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{section.compliance}% cumplimiento</span>
                  <Badge variant={section.status === 'complete' ? 'secondary' : section.status === 'in-progress' ? 'default' : 'outline'}>
                    {section.status === 'complete' ? 'Completo' : section.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Reportes Recientes</h2>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{report.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.compliance}% cumplimiento • {report.findings} hallazgos
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{report.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ISOAudit;