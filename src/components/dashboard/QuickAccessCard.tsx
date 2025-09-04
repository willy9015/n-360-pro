import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'alert' | 'primary';
  className?: string;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  variant = 'default',
  className
}) => {
  const variants = {
    default: "bg-gradient-to-br from-card to-muted border-border hover:shadow-soft",
    alert: "bg-gradient-to-br from-alert/10 to-alert-light/20 border-alert/30 hover:shadow-alert",
    primary: "bg-gradient-to-br from-primary/10 to-primary-glow/20 border-primary/30 hover:shadow-corporate"
  };

  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1",
        "border-2 backdrop-blur-sm",
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'alert' && "bg-alert text-alert-foreground",
          variant === 'primary' && "bg-primary text-primary-foreground", 
          variant === 'default' && "bg-secondary text-secondary-foreground"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">{title}</h3>
          <p className="text-muted-foreground text-xs mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};