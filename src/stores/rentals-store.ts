import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Rental {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  location: string;
  description?: string;
  image_url?: string;
  owner_id?: string;
  available: boolean;
  created_at?: string;
  updated_at?: string;
}

interface RentalsStore {
  rentals: Rental[];
  loading: boolean;
  error: string | null;
  fetchRentals: () => Promise<void>;
  fetchRentalsByOwner: (ownerId: string) => Promise<void>;
  addRental: (rental: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRental: (id: number, rental: Partial<Rental>) => Promise<void>;
  deleteRental: (id: number) => Promise<void>;
  searchRentals: (query: string) => Promise<void>;
}

export const useRentalsStore = create<RentalsStore>((set, get) => ({
  rentals: [],
  loading: false,
  error: null,

  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('Rentals table not found. Please run database migrations.');
          set({ 
            rentals: [], 
            loading: false,
            error: 'Database not initialized. Please contact support.'
          });
          return;
        }
        throw error;
      }
      
      set({ rentals: data || [], loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchRentalsByOwner: async (ownerId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ rentals: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addRental: async (rental) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rentals')
        .insert([rental])
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        rentals: [data, ...state.rentals],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateRental: async (id, rental) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rentals')
        .update(rental)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        rentals: state.rentals.map(r => r.id === id ? data : r),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteRental: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        rentals: state.rentals.filter(r => r.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  searchRentals: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('available', true)
        .ilike('name', `%${query}%`)
        .or(`category.ilike.%${query}%,location.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ rentals: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));