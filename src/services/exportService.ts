import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';

export interface CompanyBranding {
  name: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export class ExportService {
  
  // Export incidents to PDF
  static async exportIncidentsToPDF(
    incidents: any[], 
    branding: CompanyBranding,
    dateRange?: { start: string; end: string }
  ): Promise<void> {
    const doc = new jsPDF();
    
    // Header with company branding
    doc.setFontSize(20);
    doc.text(`${branding.name} - Reporte de Incidentes`, 20, 30);
    
    if (dateRange) {
      doc.setFontSize(12);
      doc.text(`Período: ${dateRange.start} - ${dateRange.end}`, 20, 45);
    }
    
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Plataforma: Guardián 45001 - ISO 45001 Compliance`, 20, 65);
    
    // Table headers
    const headers = ['Fecha', 'Título', 'Severidad', 'Estado', 'Ubicación'];
    let y = 80;
    
    doc.setFontSize(8);
    headers.forEach((header, index) => {
      doc.text(header, 20 + (index * 35), y);
    });
    
    y += 10;
    
    // Incident data
    incidents.forEach((incident) => {
      const row = [
        new Date(incident.created_at).toLocaleDateString(),
        incident.title.substring(0, 15) + '...',
        incident.severity.toUpperCase(),
        incident.status.toUpperCase(),
        incident.location.substring(0, 10) + '...'
      ];
      
      row.forEach((cell, index) => {
        doc.text(cell, 20 + (index * 35), y);
      });
      
      y += 8;
      
      if (y > 270) {
        doc.addPage();
        y = 30;
      }
    });
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, 20, 290);
      doc.text('Guardián 45001 - Seguridad Industrial ISO 45001', 150, 290);
    }
    
    doc.save(`incidentes_${branding.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  // Export checklist data to PDF
  static async exportChecklistToPDF(
    checklists: any[],
    branding: CompanyBranding
  ): Promise<void> {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`${branding.name} - Reportes de Checklist`, 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text('ISO 45001 - Sistema de Gestión de Seguridad y Salud Ocupacional', 20, 55);
    
    let y = 80;
    
    checklists.forEach((checklist, index) => {
      doc.setFontSize(14);
      doc.text(`Checklist ${index + 1}: ${checklist.name}`, 20, y);
      y += 15;
      
      doc.setFontSize(10);
      checklist.items.forEach((item: any) => {
        const status = item.completed ? '✓' : '✗';
        doc.text(`${status} ${item.description}`, 25, y);
        y += 8;
      });
      
      y += 10;
      
      if (y > 250) {
        doc.addPage();
        y = 30;
      }
    });
    
    doc.save(`checklist_${branding.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  // Export data to Excel
  static async exportToExcel(
    data: any[],
    filename: string,
    sheetName: string = 'Datos'
  ): Promise<void> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Add company header
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['Guardián 45001 - Plataforma ISO 45001'],
      ['Reporte generado:', new Date().toLocaleString()],
      [''], // Empty row
    ], { origin: 'A1' });
    
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  // Generate ISO 45001 Audit Report
  static async generateISOAuditReport(
    auditData: any,
    branding: CompanyBranding
  ): Promise<void> {
    const doc = new jsPDF();
    
    // Cover page
    doc.setFontSize(24);
    doc.text('REPORTE DE AUDITORÍA', 105, 60, { align: 'center' });
    doc.text('ISO 45001:2018', 105, 80, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`${branding.name}`, 105, 120, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 150, { align: 'center' });
    doc.text('Generado por Guardián 45001', 105, 200, { align: 'center' });
    
    doc.addPage();
    
    // Executive Summary
    doc.setFontSize(18);
    doc.text('RESUMEN EJECUTIVO', 20, 30);
    
    doc.setFontSize(12);
    let y = 50;
    
    const summary = [
      `Nivel de Cumplimiento General: ${auditData.overallCompliance}%`,
      `Total de No Conformidades: ${auditData.nonCompliances}`,
      `Oportunidades de Mejora: ${auditData.improvements}`,
      `Estado del Sistema: ${auditData.systemStatus}`
    ];
    
    summary.forEach(line => {
      doc.text(line, 20, y);
      y += 10;
    });
    
    // Detailed findings
    doc.addPage();
    doc.setFontSize(18);
    doc.text('HALLAZGOS DETALLADOS', 20, 30);
    
    y = 50;
    auditData.sections?.forEach((section: any) => {
      doc.setFontSize(14);
      doc.text(`${section.name}: ${section.compliance}%`, 20, y);
      y += 10;
      
      doc.setFontSize(10);
      section.findings?.forEach((finding: string) => {
        doc.text(`• ${finding}`, 25, y);
        y += 8;
      });
      
      y += 15;
      
      if (y > 250) {
        doc.addPage();
        y = 30;
      }
    });
    
    doc.save(`auditoria_iso45001_${branding.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}