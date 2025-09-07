import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, Eye, Download, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { OfflineService } from '@/services/offlineService';
import { ExportService } from '@/services/exportService';

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  requiredEvidence: boolean;
  evidenceUrl?: string;
}

interface Checklist {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'ppe' | 'environment' | 'procedure';
  items: ChecklistItem[];
  created_at: string;
  updated_at: string;
  status: 'draft' | 'active' | 'completed';
  assigned_to?: string;
}

const Checklists = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    description: '',
    priority: 'medium' as const,
    requiredEvidence: false
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChecklists(data || []);
    } catch (error) {
      console.error('Error loading checklists:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los checklists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewChecklist = () => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      name: 'Nuevo Checklist',
      description: '',
      category: 'safety',
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft'
    };
    setSelectedChecklist(newChecklist);
    setIsCreating(true);
    setIsEditing(true);
  };

  const saveChecklist = async () => {
    if (!selectedChecklist) return;

    try {
      if (!OfflineService.isOnline()) {
        OfflineService.storeOfflineData('checklist', selectedChecklist);
        toast({
          title: "Guardado offline",
          description: "El checklist se guardó localmente y se sincronizará cuando haya conexión",
        });
        return;
      }

      const { data, error } = isCreating
        ? await supabase.from('checklists').insert([selectedChecklist]).select().single()
        : await supabase.from('checklists').update(selectedChecklist).eq('id', selectedChecklist.id).select().single();

      if (error) throw error;

      toast({
        title: "Guardado exitoso",
        description: "El checklist se ha guardado correctamente",
      });

      setIsCreating(false);
      setIsEditing(false);
      loadChecklists();
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el checklist",
        variant: "destructive",
      });
    }
  };

  const addChecklistItem = () => {
    if (!selectedChecklist || !newItem.description) return;

    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      description: newItem.description,
      completed: false,
      priority: newItem.priority,
      requiredEvidence: newItem.requiredEvidence
    };

    setSelectedChecklist({
      ...selectedChecklist,
      items: [...selectedChecklist.items, item]
    });

    setNewItem({
      description: '',
      priority: 'medium',
      requiredEvidence: false
    });
  };

  const toggleItemCompletion = (itemId: string) => {
    if (!selectedChecklist) return;

    setSelectedChecklist({
      ...selectedChecklist,
      items: selectedChecklist.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const getStatusIcon = (status: Checklist['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getCompletionPercentage = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  const exportChecklist = () => {
    if (!selectedChecklist) return;

    ExportService.exportChecklistToPDF([selectedChecklist], {
      name: 'Tu Empresa',
      colors: { primary: '#1e40af', secondary: '#64748b' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando checklists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checklists Dinámicos</h1>
            <p className="text-muted-foreground">Gestión de inspecciones y controles</p>
          </div>
        </div>
        <Button onClick={createNewChecklist} className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Checklist
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist List */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            {checklists.map((checklist) => (
              <Card
                key={checklist.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedChecklist?.id === checklist.id ? 'border-primary' : ''
                }`}
                onClick={() => {
                  setSelectedChecklist(checklist);
                  setIsEditing(false);
                  setIsCreating(false);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{checklist.name}</h3>
                  {getStatusIcon(checklist.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{checklist.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={checklist.category === 'safety' ? 'destructive' : 'secondary'}>
                    {checklist.category}
                  </Badge>
                  <span className="text-sm font-medium text-primary">
                    {getCompletionPercentage(checklist)}%
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Checklist Detail */}
        <div className="lg:col-span-2">
          {selectedChecklist ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={selectedChecklist.name}
                      onChange={(e) => setSelectedChecklist({
                        ...selectedChecklist,
                        name: e.target.value
                      })}
                      className="text-xl font-bold mb-2"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-2">{selectedChecklist.name}</h2>
                  )}
                  {isEditing ? (
                    <Textarea
                      value={selectedChecklist.description}
                      onChange={(e) => setSelectedChecklist({
                        ...selectedChecklist,
                        description: e.target.value
                      })}
                      placeholder="Descripción del checklist"
                      className="mb-4"
                    />
                  ) : (
                    <p className="text-muted-foreground">{selectedChecklist.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportChecklist}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {isEditing && (
                    <Button size="sm" onClick={saveChecklist}>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  )}
                </div>
              </div>

              {/* Add new item (when editing) */}
              {isEditing && (
                <Card className="p-4 mb-4 bg-accent/20">
                  <div className="space-y-3">
                    <Input
                      placeholder="Descripción del item"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <div className="flex items-center space-x-4">
                      <select
                        className="px-3 py-1 border rounded"
                        value={newItem.priority}
                        onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                      <label className="flex items-center space-x-2">
                        <Checkbox
                          checked={newItem.requiredEvidence}
                          onCheckedChange={(checked) => setNewItem({ ...newItem, requiredEvidence: !!checked })}
                        />
                        <span className="text-sm">Requiere evidencia</span>
                      </label>
                      <Button size="sm" onClick={addChecklistItem}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Checklist Items */}
              <div className="space-y-3">
                {selectedChecklist.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-background'
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                        {item.requiredEvidence && (
                          <Badge variant="outline" className="text-xs">Evidencia requerida</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Selecciona un checklist para ver los detalles</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklists;