import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RotateCcw, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className }) => {
  const { isOnline, isSyncing, unsyncedCount, syncOfflineData } = useOfflineSync();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Connection Status */}
      <div className={cn(
        "flex items-center space-x-1 px-2 py-1 rounded-full text-xs",
        isOnline 
          ? "bg-green-100 text-green-700 border border-green-200" 
          : "bg-red-100 text-red-700 border border-red-200"
      )}>
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Unsynced Data Counter */}
      {unsyncedCount > 0 && (
        <Badge variant="outline" className="text-xs">
          <Database className="w-3 h-3 mr-1" />
          {unsyncedCount} sin sync
        </Badge>
      )}

      {/* Sync Button */}
      {isOnline && unsyncedCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={syncOfflineData}
          disabled={isSyncing}
          className="h-6 px-2 text-xs"
        >
          <RotateCcw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
          {isSyncing ? "Sincronizando..." : "Sync"}
        </Button>
      )}
    </div>
  );
};