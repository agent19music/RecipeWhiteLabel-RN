import { supabase } from '../lib/supabase';
import { PantryItem } from '../data/types';
import { addDays } from 'date-fns';

export interface SupabasePantryItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  purchase_date?: string;
  location: string;
  brand?: string;
  barcode?: string;
  image_url?: string;
  notes?: string;
  cost_kes?: number;
  store?: string;
  is_pinned?: boolean;
  is_low_stock?: boolean;
  is_expired?: boolean;
  minimum_quantity?: number;
  days_until_expiry?: number;
  created_at?: string;
  updated_at?: string;
}

class PantryService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Get all pantry items for current user
  async getPantryItems(): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .order('is_pinned', { ascending: false })
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Add new pantry item
  async addPantryItem(item: Partial<SupabasePantryItem>): Promise<SupabasePantryItem> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .insert({
        ...item,
        user_id: this.userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Add multiple items (from AI detection)
  async addMultiplePantryItems(items: Partial<SupabasePantryItem>[]): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const itemsWithUser = items.map(item => ({
      ...item,
      user_id: this.userId,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('pantry_items')
      .insert(itemsWithUser)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Update pantry item
  async updatePantryItem(id: string, updates: Partial<SupabasePantryItem>): Promise<SupabasePantryItem> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete pantry item
  async deletePantryItem(id: string): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  // Toggle item pin status
  async togglePinStatus(id: string): Promise<SupabasePantryItem> {
    const item = await this.getPantryItem(id);
    return this.updatePantryItem(id, { is_pinned: !item.is_pinned });
  }

  // Toggle low stock status
  async toggleLowStockStatus(id: string): Promise<SupabasePantryItem> {
    const item = await this.getPantryItem(id);
    return this.updatePantryItem(id, { is_low_stock: !item.is_low_stock });
  }

  // Get single pantry item
  async getPantryItem(id: string): Promise<SupabasePantryItem> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Search pantry items
  async searchPantryItems(query: string): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .ilike('name', `%${query}%`)
      .order('is_pinned', { ascending: false })
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get expiring items (within X days)
  async getExpiringItems(daysAhead: number = 3): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const futureDate = addDays(new Date(), daysAhead).toISOString();

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .lte('expiry_date', futureDate)
      .gte('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get low stock items
  async getLowStockItems(): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .eq('is_low_stock', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get expired items
  async getExpiredItems(): Promise<SupabasePantryItem[]> {
    if (!this.userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .lt('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Subscribe to real-time changes
  subscribeToChanges(callback: (payload: any) => void) {
    if (!this.userId) throw new Error('User not authenticated');

    return supabase
      .channel('pantry_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pantry_items',
          filter: `user_id=eq.${this.userId}`,
        },
        callback
      )
      .subscribe();
  }

  // Get pantry statistics
  async getPantryStats() {
    if (!this.userId) throw new Error('User not authenticated');

    const items = await this.getPantryItems();
    const expiringSoon = await this.getExpiringItems(3);
    const lowStock = await this.getLowStockItems();
    const expired = await this.getExpiredItems();

    // Calculate total value
    const totalValue = items.reduce((sum, item) => sum + (item.cost_kes || 0), 0);

    // Group by category
    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems: items.length,
      expiringSoon: expiringSoon.length,
      lowStock: lowStock.length,
      expired: expired.length,
      totalValue,
      byCategory,
      mostCommonCategory: Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0]?.[0] || 'other',
    };
  }

  // Convert from local PantryItem to Supabase format
  convertToSupabaseFormat(item: PantryItem): Partial<SupabasePantryItem> {
    return {
      name: item.title || item.name || '',
      category: item.category || 'other',
      quantity: item.quantity || 1,
      unit: item.unit || 'pieces',
      expiry_date: item.expiresOn || item.expiryDate,
      location: item.location || 'pantry',
      brand: item.brand,
      notes: item.notes,
      cost_kes: item.costKes || item.cost_kes,
      is_pinned: item.isPinned,
      is_low_stock: item.isLowStock,
    };
  }

  // Convert from Supabase format to local PantryItem
  convertToLocalFormat(item: SupabasePantryItem): PantryItem {
    return {
      id: item.id,
      title: item.name,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      expiresOn: item.expiry_date,
      expiryDate: item.expiry_date,
      location: item.location,
      brand: item.brand,
      notes: item.notes,
      costKes: item.cost_kes,
      cost_kes: item.cost_kes,
      isPinned: item.is_pinned,
      isLowStock: item.is_low_stock,
      daysUntilExpiry: item.days_until_expiry,
    };
  }
}

export const pantryService = new PantryService();