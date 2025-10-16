import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// These should be replaced with your actual Supabase credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-project-url';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a safe storage adapter that works in all environments
const createStorageAdapter = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  
  if (Platform.OS === 'web' && isBrowser) {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
    };
  } else if (Platform.OS === 'web' && !isBrowser) {
    // Server-side or static build - use a no-op storage
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  } else {
    // Mobile platforms
    return AsyncStorage;
  }
};

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: typeof window !== 'undefined',
    detectSessionInUrl: Platform.OS === 'web' && typeof window !== 'undefined',
  },
});

export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== 'your-project-url' && SUPABASE_ANON_KEY !== 'your-anon-key';
};