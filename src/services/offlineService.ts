import { supabase } from '@/lib/supabase';

export interface OfflineData {
  id: string;
  type: 'incident' | 'checklist' | 'inspection' | 'report';
  data: any;
  timestamp: string;
  synced: boolean;
}

export class OfflineService {
  private static readonly STORAGE_KEY = 'guardian_offline_data';
  
  // Store data offline
  static storeOfflineData(type: OfflineData['type'], data: any): string {
    const offlineRecord: OfflineData = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const existingData = this.getOfflineData();
    existingData.push(offlineRecord);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
    return offlineRecord.id;
  }

  // Get all offline data
  static getOfflineData(): OfflineData[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get unsynced data
  static getUnsyncedData(): OfflineData[] {
    return this.getOfflineData().filter(item => !item.synced);
  }

  // Sync offline data when connection is restored
  static async syncOfflineData(): Promise<{ success: number; failed: number }> {
    const unsyncedData = this.getUnsyncedData();
    let successCount = 0;
    let failedCount = 0;

    for (const item of unsyncedData) {
      try {
        await this.syncSingleItem(item);
        this.markAsSynced(item.id);
        successCount++;
      } catch (error) {
        console.error('Failed to sync item:', item.id, error);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  }

  // Sync a single item based on its type
  private static async syncSingleItem(item: OfflineData): Promise<void> {
    switch (item.type) {
      case 'incident':
        await supabase.from('incidents').insert([item.data]);
        break;
      case 'checklist':
        await supabase.from('checklists').insert([item.data]);
        break;
      case 'inspection':
        await supabase.from('ppe_inspections').insert([item.data]);
        break;
      case 'report':
        await supabase.from('reports').insert([item.data]);
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }
  }

  // Mark item as synced
  private static markAsSynced(id: string): void {
    const data = this.getOfflineData();
    const item = data.find(d => d.id === id);
    if (item) {
      item.synced = true;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  // Check if device is online
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Clear synced data to free storage
  static clearSyncedData(): void {
    const data = this.getOfflineData().filter(item => !item.synced);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Get storage usage
  static getStorageUsage(): { used: number; percentage: number } {
    const data = JSON.stringify(this.getOfflineData());
    const used = new Blob([data]).size;
    const maxStorage = 5 * 1024 * 1024; // 5MB limit
    return {
      used,
      percentage: (used / maxStorage) * 100
    };
  }
}