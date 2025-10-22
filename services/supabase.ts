import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../utils/config';

// Configuración de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://aereiuyggnzlmhqdqvlo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcmVpdXlnZ256bG1ocWRxdmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA0OTQsImV4cCI6MjA3NTMzNjQ5NH0.mxt81o_4Hw_M7ldri-UENyQdjqJL-zmRWNjesTdFqqQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';
          company?: string;
          phone?: string;
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';
          company?: string;
          phone?: string;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';
          company?: string;
          phone?: string;
          status?: 'active' | 'inactive' | 'suspended';
          updated_at?: string;
        };
      };
      containers: {
        Row: {
          id: string;
          number: string;
          type: 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank';
          size: '20' | '40' | '45';
          status: 'pending' | 'in_port' | 'customs_pending' | 'customs_approved' | 'in_transit' | 'delivered' | 'returned' | 'damaged' | 'lost' | 'on_hold' | 'inspection_required' | 'documentation_incomplete' | 'payment_pending' | 'released' | 'archived';
          origin_port: string;
          destination_port: string;
          arrival_date?: string;
          client_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          type: 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank';
          size: '20' | '40' | '45';
          status?: 'pending' | 'in_port' | 'customs_pending' | 'customs_approved' | 'in_transit' | 'delivered' | 'returned' | 'damaged' | 'lost' | 'on_hold' | 'inspection_required' | 'documentation_incomplete' | 'payment_pending' | 'released' | 'archived';
          origin_port: string;
          destination_port: string;
          arrival_date?: string;
          client_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          type?: 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank';
          size?: '20' | '40' | '45';
          status?: 'pending' | 'in_port' | 'customs_pending' | 'customs_approved' | 'in_transit' | 'delivered' | 'returned' | 'damaged' | 'lost' | 'on_hold' | 'inspection_required' | 'documentation_incomplete' | 'payment_pending' | 'released' | 'archived';
          origin_port?: string;
          destination_port?: string;
          arrival_date?: string;
          client_id?: string;
          updated_at?: string;
        };
      };
      instruction_letters: {
        Row: {
          id: string;
          container_id: string;
          client_id: string;
          title: string;
          description: string;
          status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'in_process' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          shipment_info: any; // JSON
          cargo_info: any; // JSON
          special_instructions?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          container_id: string;
          client_id: string;
          title: string;
          description: string;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'in_process' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          shipment_info: any;
          cargo_info: any;
          special_instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          container_id?: string;
          client_id?: string;
          title?: string;
          description?: string;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'in_process' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          shipment_info?: any;
          cargo_info?: any;
          special_instructions?: string;
          updated_at?: string;
        };
      };
      instruction_documents: {
        Row: {
          id: string;
          instruction_id: string;
          name: string;
          type: 'invoice' | 'packing_list' | 'bill_of_lading' | 'certificate' | 'permit' | 'other';
          file_url: string;
          file_size: number;
          mime_type: string;
          status: 'pending' | 'approved' | 'rejected';
          uploaded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          instruction_id: string;
          name: string;
          type: 'invoice' | 'packing_list' | 'bill_of_lading' | 'certificate' | 'permit' | 'other';
          file_url: string;
          file_size: number;
          mime_type: string;
          status?: 'pending' | 'approved' | 'rejected';
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          instruction_id?: string;
          name?: string;
          type?: 'invoice' | 'packing_list' | 'bill_of_lading' | 'certificate' | 'permit' | 'other';
          file_url?: string;
          file_size?: number;
          mime_type?: string;
          status?: 'pending' | 'approved' | 'rejected';
          uploaded_by?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          container_id: string;
          client_id: string;
          instruction_id?: string;
          type: 'port_fees' | 'customs_duties' | 'storage_fees' | 'handling_charges' | 'documentation_fees' | 'inspection_fees' | 'demurrage' | 'detention' | 'transport_costs' | 'other_charges';
          amount: number;
          currency: string;
          status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string;
          paid_date?: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          container_id: string;
          client_id: string;
          instruction_id?: string;
          type: 'port_fees' | 'customs_duties' | 'storage_fees' | 'handling_charges' | 'documentation_fees' | 'inspection_fees' | 'demurrage' | 'detention' | 'transport_costs' | 'other_charges';
          amount: number;
          currency?: string;
          status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string;
          paid_date?: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          container_id?: string;
          client_id?: string;
          instruction_id?: string;
          type?: 'port_fees' | 'customs_duties' | 'storage_fees' | 'handling_charges' | 'documentation_fees' | 'inspection_fees' | 'demurrage' | 'detention' | 'transport_costs' | 'other_charges';
          amount?: number;
          currency?: string;
          status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string;
          paid_date?: string;
          description?: string;
          updated_at?: string;
        };
      };
      payment_receipts: {
        Row: {
          id: string;
          payment_id: string;
          receipt_number: string;
          amount: number;
          currency: string;
          payment_method: string;
          reference: string;
          file_url?: string;
          status: 'pending' | 'verified' | 'rejected';
          notes?: string;
          processed_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          receipt_number: string;
          amount: number;
          currency?: string;
          payment_method: string;
          reference: string;
          file_url?: string;
          status?: 'pending' | 'verified' | 'rejected';
          notes?: string;
          processed_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          receipt_number?: string;
          amount?: number;
          currency?: string;
          payment_method?: string;
          reference?: string;
          file_url?: string;
          status?: 'pending' | 'verified' | 'rejected';
          notes?: string;
          processed_by?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Funciones de utilidad para Auth
export const auth = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (data.user && !error) {
      // Crear perfil de usuario
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          ...userData,
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }
    
    return { data, error };
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getSession: async () => {
    return await supabase.auth.getSession();
  },
  
  getUser: async () => {
    return await supabase.auth.getUser();
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },
};

// Funciones CRUD para contenedores
export const containers = {
  getAll: async (clientId?: string) => {
    let query = supabase.from('containers').select(`
      *,
      client:users!containers_client_id_fkey(name, email, company)
    `);
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    return await query.order('created_at', { ascending: false });
  },
  
  getById: async (id: string) => {
    return await supabase
      .from('containers')
      .select(`
        *,
        client:users!containers_client_id_fkey(name, email, company)
      `)
      .eq('id', id)
      .single();
  },
  
  create: async (container: Database['public']['Tables']['containers']['Insert']) => {
    return await supabase.from('containers').insert(container).select().single();
  },
  
  update: async (id: string, updates: Database['public']['Tables']['containers']['Update']) => {
    return await supabase
      .from('containers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
  
  delete: async (id: string) => {
    return await supabase.from('containers').delete().eq('id', id);
  },
};

// Funciones CRUD para cartas de instrucción
export const instructionLetters = {
  getAll: async (clientId?: string) => {
    let query = supabase.from('instruction_letters').select(`
      *,
      container:containers!instruction_letters_container_id_fkey(number, type, size),
      client:users!instruction_letters_client_id_fkey(name, email, company),
      documents:instruction_documents(*)
    `);
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    return await query.order('created_at', { ascending: false });
  },
  
  getById: async (id: string) => {
    return await supabase
      .from('instruction_letters')
      .select(`
        *,
        container:containers!instruction_letters_container_id_fkey(number, type, size),
        client:users!instruction_letters_client_id_fkey(name, email, company),
        documents:instruction_documents(*)
      `)
      .eq('id', id)
      .single();
  },
  
  create: async (instruction: Database['public']['Tables']['instruction_letters']['Insert']) => {
    return await supabase.from('instruction_letters').insert(instruction).select().single();
  },
  
  update: async (id: string, updates: Database['public']['Tables']['instruction_letters']['Update']) => {
    return await supabase
      .from('instruction_letters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
  
  delete: async (id: string) => {
    return await supabase.from('instruction_letters').delete().eq('id', id);
  },
};

// Funciones CRUD para pagos
export const payments = {
  getAll: async (clientId?: string) => {
    let query = supabase.from('payments').select(`
      *,
      container:containers!payments_container_id_fkey(number, type, size),
      client:users!payments_client_id_fkey(name, email, company),
      instruction:instruction_letters!payments_instruction_id_fkey(title),
      receipts:payment_receipts(*)
    `);
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    return await query.order('due_date', { ascending: true });
  },
  
  getById: async (id: string) => {
    return await supabase
      .from('payments')
      .select(`
        *,
        container:containers!payments_container_id_fkey(number, type, size),
        client:users!payments_client_id_fkey(name, email, company),
        instruction:instruction_letters!payments_instruction_id_fkey(title),
        receipts:payment_receipts(*)
      `)
      .eq('id', id)
      .single();
  },
  
  create: async (payment: Database['public']['Tables']['payments']['Insert']) => {
    return await supabase.from('payments').insert(payment).select().single();
  },
  
  update: async (id: string, updates: Database['public']['Tables']['payments']['Update']) => {
    return await supabase
      .from('payments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
  
  delete: async (id: string) => {
    return await supabase.from('payments').delete().eq('id', id);
  },
};

// Funciones para archivos/documentos
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file);
  },
  
  downloadFile: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).download(path);
  },
  
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
  
  deleteFile: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).remove([path]);
  },
};

// Suscripciones en tiempo real
export const subscriptions = {
  containers: (callback: (payload: any) => void) => {
    return supabase
      .channel('containers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'containers' }, callback)
      .subscribe();
  },
  
  instructions: (callback: (payload: any) => void) => {
    return supabase
      .channel('instructions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instruction_letters' }, callback)
      .subscribe();
  },
  
  payments: (callback: (payload: any) => void) => {
    return supabase
      .channel('payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
      .subscribe();
  },
};

export default supabase;