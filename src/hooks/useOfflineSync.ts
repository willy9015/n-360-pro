import { useState, useEffect } from 'react';
import { OfflineService } from '@/services/offlineService';
import { useToast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      
      if (navigator.onLine) {
        syncOfflineData();
      }
    };

    const updateUnsyncedCount = () => {
      setUnsyncedCount(OfflineService.getUnsyncedData().length);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Update unsynced count on page load
    updateUnsyncedCount();
    
    // Set up periodic check for unsynced data
    const interval = setInterval(updateUnsyncedCount, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const syncOfflineData = async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    
    try {
      const result = await OfflineService.syncOfflineData();
      
      if (result.success > 0) {
        toast({
          title: "Sincronización exitosa",
          description: `${result.success} elementos sincronizados correctamente`,
        });
      }
      
      if (result.failed > 0) {
        toast({
          title: "Error en sincronización",
          description: `${result.failed} elementos no se pudieron sincronizar`,
          variant: "destructive",
        });
      }
      
      setUnsyncedCount(OfflineService.getUnsyncedData().length);
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Error de sincronización",
        description: "No se pudo completar la sincronización",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const storeOffline = (type: 'incident' | 'checklist' | 'inspection' | 'report', data: any) => {
    const id = OfflineService.storeOfflineData(type, data);
    setUnsyncedCount(OfflineService.getUnsyncedData().length);
    
    toast({
      title: "Guardado offline",
      description: "Los datos se guardaron localmente y se sincronizarán cuando haya conexión",
    });
    
    return id;
  };

  return {
    isOnline,
    isSyncing,
    unsyncedCount,
    syncOfflineData,
    storeOffline
  };
};