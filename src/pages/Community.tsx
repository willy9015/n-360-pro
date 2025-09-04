import React from 'react';
import { ArrowLeft, Users, MessageCircle, Star, Share2, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const navigate = useNavigate();

  const discussions = [
    {
      user: "Carlos Mendoza",
      company: "Aceros del Norte",
      title: "Nuevo protocolo para soldadura en altura",
      time: "Hace 2 horas",
      likes: 15,
      replies: 8,
      reputation: 850
    },
    {
      user: "Ana Rodríguez",
      company: "Química Industrial SA",
      title: "¿Experiencias con sensores IoT para gases?",
      time: "Hace 4 horas", 
      likes: 23,
      replies: 12,
      reputation: 1200
    },
    {
      user: "Miguel Torres",
      company: "Construcciones Beta",
      title: "Compartiendo checklist de EPP actualizado",
      time: "Ayer",
      likes: 31,
      replies: 5,
      reputation: 650
    }
  ];

  const sharedResources = [
    {
      title: "Template Auditoría ISO 45001",
      author: "Laura Espinoza",
      company: "Minera Los Andes",
      downloads: 245,
      rating: 4.8,
      type: "Documento"
    },
    {
      title: "App móvil para reporte de incidentes",
      author: "Tech Safety Solutions",
      company: "Desarrollador Verificado",
      downloads: 1200,
      rating: 4.6,
      type: "Herramienta"
    }
  ];

  const topContributors = [
    { name: "Elena Vega", reputation: 2450, contributions: 85 },
    { name: "Roberto Silva", reputation: 2100, contributions: 72 },
    { name: "Patricia Morales", reputation: 1890, contributions: 68 }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Comunidad</h1>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">2,847</p>
          <p className="text-xs text-muted-foreground">Miembros activos</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">156</p>
          <p className="text-xs text-muted-foreground">Discusiones hoy</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">89</p>
          <p className="text-xs text-muted-foreground">Recursos compartidos</p>
        </Card>
      </div>

      {/* Recent Discussions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Discusiones Recientes</h2>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            Nueva
          </Button>
        </div>
        
        <div className="space-y-3">
          {discussions.map((discussion, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {discussion.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{discussion.user}</span>
                    <Badge variant="outline" className="text-xs">{discussion.reputation} pts</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{discussion.company}</p>
                  <h3 className="text-sm font-medium text-foreground mb-2">{discussion.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{discussion.time}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{discussion.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{discussion.replies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Shared Resources */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recursos Compartidos</h2>
        <div className="space-y-3">
          {sharedResources.map((resource, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">{resource.title}</h3>
                    <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Por {resource.author} • {resource.company}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">{resource.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{resource.downloads} descargas</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Principales Colaboradores</h2>
        <div className="space-y-3">
          {topContributors.map((contributor, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {contributor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contributor.reputation} puntos • {contributor.contributions} contribuciones
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;