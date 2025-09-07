import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  completed: {
    label: 'Completado',
    variant: 'default' as const,
    icon: CheckCircle,
    color: 'text-green-600'
  },
  in_progress: {
    label: 'En Progreso',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-blue-600'
  },
  pending: {
    label: 'Pendiente',
    variant: 'outline' as const,
    icon: AlertTriangle,
    color: 'text-yellow-600'
  },
  failed: {
    label: 'Fallido',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'flex items-center gap-1',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-2 py-1',
        size === 'lg' && 'text-base px-3 py-1.5',
        className
      )}
    >
      {showIcon && <Icon className={cn(
        size === 'sm' && 'w-3 h-3',
        size === 'md' && 'w-4 h-4',
        size === 'lg' && 'w-5 h-5',
        config.color
      )} />}
      {config.label}
    </Badge>
  );
};