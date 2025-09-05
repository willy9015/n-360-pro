import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface PPEDetectionResult {
  detected: boolean;
  confidence: number;
  equipment: string[];
  missing: string[];
  recommendations: string[];
}

export interface SafetyAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: string[];
  recommendations: string[];
  confidence: number;
}

export interface AudioAnalysisResult {
  text: string;
  intent: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  actions: string[];
}

export class AIServices {
  private static imageClassifier: any = null;
  private static textClassifier: any = null;
  private static speechRecognizer: any = null;

  // Initialize AI models
  static async initializeModels() {
    try {
      console.log('Initializing AI models...');
      
      // Initialize image classification for PPE detection
      if (!this.imageClassifier) {
        this.imageClassifier = await pipeline(
          'image-classification',
          'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
          { device: 'webgpu' }
        );
      }

      // Initialize text classification for safety analysis
      if (!this.textClassifier) {
        this.textClassifier = await pipeline(
          'text-classification',
          'cardiffnlp/twitter-roberta-base-sentiment-latest'
        );
      }

      console.log('AI models initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing AI models:', error);
      return false;
    }
  }

  // Analyze PPE compliance from image
  static async analyzePPECompliance(imageFile: File): Promise<PPEDetectionResult> {
    try {
      await this.initializeModels();
      
      const imageUrl = URL.createObjectURL(imageFile);
      const result = await this.imageClassifier(imageUrl);
      
      // Process results to detect PPE
      const ppeItems = ['helmet', 'vest', 'gloves', 'boots', 'goggles', 'mask'];
      const detected: string[] = [];
      const missing: string[] = [];
      
      // Simulate PPE detection based on image classification
      let confidence = 0;
      result.forEach((item: any) => {
        confidence = Math.max(confidence, item.score);
        const label = item.label.toLowerCase();
        
        ppeItems.forEach(ppe => {
          if (label.includes(ppe) || label.includes('safety') || label.includes('protective')) {
            if (!detected.includes(ppe)) detected.push(ppe);
          }
        });
      });

      // Determine missing PPE
      ppeItems.forEach(ppe => {
        if (!detected.includes(ppe)) missing.push(ppe);
      });

      const recommendations = missing.length > 0 
        ? [`Usar ${missing.join(', ')}`, 'Verificar cumplimiento normativo', 'Reportar al supervisor']
        : ['Cumplimiento correcto de EPP', 'Continuar con buenas prácticas'];

      URL.revokeObjectURL(imageUrl);

      return {
        detected: detected.length > 0,
        confidence,
        equipment: detected,
        missing,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing PPE compliance:', error);
      throw error;
    }
  }

  // Analyze safety report text
  static async analyzeSafetyText(text: string): Promise<SafetyAnalysisResult> {
    try {
      await this.initializeModels();
      
      const result = await this.textClassifier(text);
      
      // Analyze text for safety risks
      const riskKeywords = {
        critical: ['muerte', 'explosión', 'fuego', 'tóxico', 'grave', 'fatal'],
        high: ['peligro', 'riesgo alto', 'lesión', 'accidente', 'urgente'],
        medium: ['precaución', 'cuidado', 'atención', 'revisar', 'inspeccionar'],
        low: ['normal', 'rutina', 'preventivo', 'mantenimiento']
      };

      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const risks: string[] = [];
      
      const textLower = text.toLowerCase();
      
      // Determine risk level based on keywords
      if (riskKeywords.critical.some(keyword => textLower.includes(keyword))) {
        riskLevel = 'critical';
        risks.push('Riesgo crítico identificado');
      } else if (riskKeywords.high.some(keyword => textLower.includes(keyword))) {
        riskLevel = 'high';
        risks.push('Riesgo alto detectado');
      } else if (riskKeywords.medium.some(keyword => textLower.includes(keyword))) {
        riskLevel = 'medium';
        risks.push('Riesgo medio identificado');
      } else {
        risks.push('Situación normal');
      }

      const recommendations = this.generateSafetyRecommendations(riskLevel);
      const confidence = result[0]?.score || 0.7;

      return {
        riskLevel,
        risks,
        recommendations,
        confidence
      };
    } catch (error) {
      console.error('Error analyzing safety text:', error);
      throw error;
    }
  }

  // Process audio for safety commands
  static async processAudioCommand(audioBlob: Blob): Promise<AudioAnalysisResult> {
    try {
      // Simulate speech-to-text processing
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // In a real implementation, you would use a speech recognition service
      // For demo purposes, we'll simulate the response
      const simulatedTexts = [
        'Emergencia en zona 3, necesito asistencia inmediata',
        'Inspección de rutina completada en sector A',
        'Derrame de químico en el almacén, requiere limpieza',
        'Equipo de protección dañado en línea de producción',
        'Todo normal en mi ronda de seguridad'
      ];
      
      const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
      
      // Analyze the transcribed text
      const textAnalysis = await this.analyzeSafetyText(text);
      
      let priority: 'low' | 'medium' | 'high' | 'emergency' = 'low';
      let actions: string[] = [];
      
      const textLower = text.toLowerCase();
      
      if (textLower.includes('emergencia') || textLower.includes('urgente')) {
        priority = 'emergency';
        actions = ['Activar protocolo de emergencia', 'Notificar a supervisores', 'Enviar equipo de respuesta'];
      } else if (textLower.includes('derrame') || textLower.includes('accidente')) {
        priority = 'high';
        actions = ['Aislar área', 'Notificar mantenimiento', 'Documentar incidente'];
      } else if (textLower.includes('dañado') || textLower.includes('problema')) {
        priority = 'medium';
        actions = ['Programar reparación', 'Etiquetar equipo', 'Reportar a mantenimiento'];
      } else {
        actions = ['Registrar en bitácora', 'Continuar ronda'];
      }

      const intent = this.determineIntent(text);
      
      URL.revokeObjectURL(audioUrl);

      return {
        text,
        intent,
        priority,
        actions
      };
    } catch (error) {
      console.error('Error processing audio command:', error);
      throw error;
    }
  }

  // Generate safety recommendations based on risk level
  private static generateSafetyRecommendations(riskLevel: string): string[] {
    const recommendations = {
      critical: [
        'Evacuación inmediata del área',
        'Activar protocolo de emergencia',
        'Notificar autoridades competentes',
        'Documentar incidente crítico'
      ],
      high: [
        'Aislar área afectada',
        'Implementar medidas correctivas inmediatas',
        'Notificar a supervisor de seguridad',
        'Revisar procedimientos'
      ],
      medium: [
        'Programar inspección detallada',
        'Implementar medidas preventivas',
        'Capacitar al personal',
        'Monitorear situación'
      ],
      low: [
        'Mantener vigilancia rutinaria',
        'Continuar con procedimientos normales',
        'Registrar en bitácora',
        'Programar mantenimiento preventivo'
      ]
    };

    return recommendations[riskLevel as keyof typeof recommendations] || recommendations.low;
  }

  // Determine intent from text
  private static determineIntent(text: string): string {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('emergencia')) return 'emergency_report';
    if (textLower.includes('inspección')) return 'inspection_report';
    if (textLower.includes('derrame')) return 'spill_report';
    if (textLower.includes('equipo')) return 'equipment_issue';
    if (textLower.includes('normal')) return 'routine_check';
    
    return 'general_report';
  }

  // Predict safety incidents based on historical data
  static async predictSafetyIncidents(data: any[]): Promise<{
    riskScore: number;
    predictions: string[];
    recommendations: string[];
  }> {
    try {
      // Simulate predictive analysis
      const riskScore = Math.random() * 100;
      
      const predictions = [
        'Incremento del 15% en riesgo de accidentes en área de producción',
        'Posible sobrecarga de trabajo en turno nocturno',
        'Deterioro detectado en equipos de protección',
        'Incremento de reportes de fatiga en personal'
      ];

      const recommendations = [
        'Incrementar frecuencia de inspecciones',
        'Revisar rotación de personal',
        'Actualizar programa de capacitación',
        'Renovar equipos de protección personal'
      ];

      return {
        riskScore,
        predictions: predictions.slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 1)
      };
    } catch (error) {
      console.error('Error predicting safety incidents:', error);
      throw error;
    }
  }
}