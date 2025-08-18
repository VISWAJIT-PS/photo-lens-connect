import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Photographer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  image_url?: string;
  bio?: string;
  portfolio_count?: number;
  experience_years?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface PhotographersStore {
  photographers: Photographer[];
  loading: boolean;
  error: string | null;
  fetchPhotographers: () => Promise<void>;
  fetchPhotographerById: (id: string) => Promise<Photographer | null>;
  addPhotographer: (photographer: Omit<Photographer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePhotographer: (id: string, photographer: Partial<Photographer>) => Promise<void>;
  deletePhotographer: (id: string) => Promise<void>;
  searchPhotographers: (query: string) => Promise<void>;
  filterBySpecialization: (specialization: string) => Promise<void>;
}

export const usePhotographersStore = create<PhotographersStore>((set, get) => ({
  photographers: [],
  loading: false,
  error: null,

  fetchPhotographers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('Photographers table not found. Please run database migrations.');
          set({ 
            photographers: [], 
            loading: false,
            error: 'Database not initialized. Please contact support.'
          });
          return;
        }
        throw error;
      }
      
      set({ photographers: data || [], loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch photographers:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPhotographerById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  addPhotographer: async (photographer) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .insert([photographer])
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        photographers: [data, ...state.photographers],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updatePhotographer: async (id, photographer) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .update(photographer)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        photographers: state.photographers.map(p => p.id === id ? data : p),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deletePhotographer: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('photographers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        photographers: state.photographers.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  searchPhotographers: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .ilike('name', `%${query}%`)
        .or(`specialization.ilike.%${query}%,location.ilike.%${query}%`)
        .order('rating', { ascending: false });

      if (error) throw error;
      set({ photographers: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  filterBySpecialization: async (specialization: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .eq('specialization', specialization)
        .order('rating', { ascending: false });

      if (error) throw error;
      set({ photographers: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));