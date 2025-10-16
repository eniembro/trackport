import { supabaseClient as supabase } from '../../lib/supabase';
import { SecurityService } from './securityService';
import { CredentialNotificationService, CredentialNotificationPayload } from './credentialNotificationService';

export interface SystemModule {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModulePermission {
  id: string;
  module_id: string;
  permission_code: string;
  permission_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'supervisor' | 'operator';
  module_id?: string;
  department?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by?: string;
  granted_at: string;
  is_active: boolean;
}

export interface NotificationData {
  email?: string;
  phone?: string;
  whatsapp?: string;
  preferred_method: 'email' | 'whatsapp' | 'sms';
}

export interface CreateUserData {
  email: string;
  password?: string;
  username?: string;
  full_name?: string;
  module: string;
  role?: 'admin' | 'user' | 'supervisor' | 'operator';
  department?: string;
  permissions?: string[];
  notification_data: NotificationData;
}

export interface AdminUser {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  user_created_at: string;
  modules: Array<{
    module_name: string;
    module_display_name: string;
    role: string;
    department?: string;
    permissions: string[];
  }>;
  notification_data?: NotificationData;
  last_login?: string;
  is_active: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  isAdmin?: boolean;
}

export class AdminService {
  private static readonly ADMIN_EMAIL = 'eniembro@icloud.com';
  private static readonly ADMIN_PERMISSIONS = [
    'manage_users',
    'manage_roles',
    'view_audit_logs',
    'system_config',
    'backup_restore'
  ];

  /**
   * Verificar si el usuario actual es admin
   */
  static async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error verifying admin:', error);
      return false;
    }
  }

  /**
   * Obtener rol del usuario actual
   */
  static async getCurrentUserRole(): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_role');
      
      if (error) {
        console.error('Error getting user role:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  }

  /**
   * Obtener rol de un usuario específico
   */
  static async getUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error getting user role:', error);
        return null;
      }

      return data?.role || 'user';
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  }

  /**
   * Obtener todos los módulos del sistema
   */
  static async getSystemModules(): Promise<SystemModule[]> {
    try {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true)
        .order('display_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting system modules:', error);
      throw error;
    }
  }

  /**
   * Obtener permisos de un módulo específico
   */
  static async getModulePermissions(moduleId: string): Promise<ModulePermission[]> {
    try {
      const { data, error } = await supabase
        .from('module_permissions')
        .select('*')
        .eq('module_id', moduleId)
        .eq('is_active', true)
        .order('permission_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting module permissions:', error);
      throw error;
    }
  }

  /**
   * Crear usuario con módulo y permisos específicos
   */
  static async createModularUser(userData: CreateUserData): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, message: 'Acceso denegado: Se requieren permisos de administrador' };
      }

      // Generar contraseña temporal si no se proporciona
      const tempPassword = userData.password || this.generateTemporaryPassword();
      
      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: tempPassword,
        user_metadata: {
          username: userData.username,
          full_name: userData.full_name,
          created_by_admin: true
        }
      });

      if (authError || !authData.user) {
        return { success: false, message: authError?.message || 'Error creando usuario' };
      }

      // Obtener módulo
      const { data: moduleData, error: moduleError } = await supabase
        .from('system_modules')
        .select('id')
        .eq('name', userData.module)
        .single();

      if (moduleError || !moduleData) {
        return { success: false, message: `Módulo ${userData.module} no encontrado` };
      }

      // Asignar usuario a módulo usando función SQL
      const { error: assignError } = await supabase.rpc('assign_user_to_module', {
        user_uuid: authData.user.id,
        module_name: userData.module,
        user_role: userData.role || 'user',
        user_department: userData.department,
        permission_codes: userData.permissions || []
      });

      if (assignError) {
        console.error('Error assigning user to module:', assignError);
        return { success: false, message: 'Error asignando usuario a módulo' };
      }

      // Guardar datos de notificación
      if (userData.notification_data) {
        await this.saveUserNotificationData(authData.user.id, userData.notification_data);
      }

      // Registrar creación en log de auditoría
      await this.logUserCreation({
        created_user_id: authData.user.id,
        username: userData.username || userData.email,
        email: userData.email,
        module: userData.module,
        department: userData.department,
        notification_method: userData.notification_data.preferred_method,
        temporary_password: tempPassword
      });

      // Enviar credenciales por el método preferido
      await this.sendUserCredentials(userData, tempPassword);

      return { 
        success: true, 
        message: 'Usuario creado exitosamente y credenciales enviadas',
        userId: authData.user.id
      };
    } catch (error) {
      console.error('Error creating modular user:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Enviar credenciales al usuario
   */
  private static async sendUserCredentials(userData: CreateUserData, tempPassword: string): Promise<void> {
    try {
      const payload: CredentialNotificationPayload = {
        username: userData.username || userData.email.split('@')[0],
        email: userData.email,
        temporaryPassword: tempPassword,
        module: userData.module,
        role: userData.role || 'user',
        department: userData.department,
        appName: 'TrackPort'
      };

      const notificationData = userData.notification_data;

      switch (notificationData.preferred_method) {
        case 'email':
          if (notificationData.email) {
            await CredentialNotificationService.sendCredentialsByEmail(notificationData.email, payload);
          }
          break;
        
        case 'whatsapp':
          if (notificationData.whatsapp) {
            await CredentialNotificationService.sendCredentialsByWhatsApp(notificationData.whatsapp, payload);
          }
          break;
        
        case 'sms':
          if (notificationData.phone) {
            await CredentialNotificationService.sendCredentialsBySMS(notificationData.phone, payload);
          }
          break;
      }

      // Marcar notificación como enviada
      await supabase
        .from('user_creation_log')
        .update({ notification_sent: true })
        .eq('email', userData.email);

    } catch (error) {
      console.error('Error sending user credentials:', error);
    }
  }

  /**
   * Obtener todos los usuarios con sus módulos y permisos
   */
  static async getAllModularUsers(): Promise<AdminUser[]> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Acceso denegado: Se requieren permisos de administrador');
      }

      // Obtener usuarios con sus roles y módulos
      const { data: usersData, error: usersError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          department,
          created_at,
          system_modules!inner(name, display_name),
          user_permissions!inner(
            module_permissions!inner(permission_code, permission_name)
          )
        `)
        .eq('is_active', true);

      if (usersError) throw usersError;

      // Obtener información de auth.users
      const userIds = [...new Set(usersData?.map((u: any) => u.user_id) || [])];
      const authUsers = await Promise.all(
        userIds.map(async (id) => {
          const { data } = await supabase.auth.admin.getUserById(id);
          return data.user;
        })
      );

      // Obtener datos de notificación
      const { data: notificationData } = await supabase
        .from('user_notifications')
        .select('*')
        .in('user_id', userIds);

      // Combinar datos
      const users: AdminUser[] = authUsers
        .filter((user: any) => user)
        .map((user: any) => {
          const userRoles = usersData?.filter((ur: any) => ur.user_id === user!.id) || [];
          const userNotifications = notificationData?.find((n: any) => n.user_id === user!.id);
          
          return {
            id: user!.id,
            email: user!.email || '',
            username: user!.user_metadata?.username,
            full_name: user!.user_metadata?.full_name,
            user_created_at: user!.created_at,
            modules: userRoles.map((ur: any) => ({
              module_name: (ur.system_modules as any)?.name || '',
              module_display_name: (ur.system_modules as any)?.display_name || '',
              role: ur.role,
              department: ur.department,
              permissions: ((ur.user_permissions as any) || []).map((up: any) => up.module_permissions?.permission_code).filter(Boolean) || []
            })),
            notification_data: userNotifications ? {
              email: userNotifications.email,
              phone: userNotifications.phone,
              whatsapp: userNotifications.whatsapp,
              preferred_method: userNotifications.preferred_method
            } : undefined,
            last_login: user!.last_sign_in_at,
            is_active: true
          };
        });

      return users;
    } catch (error) {
      console.error('Error getting modular users:', error);
      throw error;
    }
  }

  /**
   * Eliminar usuario (solo admin)
   */
  static async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        return { success: false, message: 'Acceso denegado: Se requieren permisos de administrador' };
      }

      // No permitir eliminar al admin principal
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData.user?.email === this.ADMIN_EMAIL) {
        return { success: false, message: 'No se puede eliminar al administrador principal' };
      }

      // Eliminar usuario de auth (esto también eliminará registros relacionados por CASCADE)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        throw error;
      }

      return { success: true, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Generar contraseña temporal
   */
  private static generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Guardar datos de notificación del usuario
   */
  private static async saveUserNotificationData(userId: string, notificationData: NotificationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .upsert({
          user_id: userId,
          email: notificationData.email,
          phone: notificationData.phone,
          whatsapp: notificationData.whatsapp,
          preferred_method: notificationData.preferred_method
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving notification data:', error);
      throw error;
    }
  }

  /**
   * Registrar creación de usuario en log de auditoría
   */
  private static async logUserCreation(logData: {
    created_user_id: string;
    username: string;
    email: string;
    module: string;
    department?: string;
    notification_method: string;
    temporary_password: string;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_creation_log')
        .insert({
          created_user_id: logData.created_user_id,
          created_by: user?.id,
          username: logData.username,
          email: logData.email,
          module: logData.module,
          department: logData.department,
          notification_method: logData.notification_method,
          temporary_password_hash: await SecurityService.hashString(logData.temporary_password),
          password_reset_required: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging user creation:', error);
      throw error;
    }
  }

  /**
   * Login de administrador
   */
  static async adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
    try {
      // Verificar credenciales de administrador
      if (email !== this.ADMIN_EMAIL || password !== '080880') {
        return { success: false, message: 'Credenciales de administrador inválidas' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        return { success: true, message: 'Login exitoso', isAdmin: true };
      }

      return { success: false, message: 'Error en la autenticación' };
    } catch (error) {
      console.error('Error during admin login:', error);
      return { success: false, message: 'Error del servidor' };
    }
  }
}