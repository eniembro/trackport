#!/usr/bin/env node

// Script para crear usuarios iniciales en TrackPort
// Requiere acceso a Supabase

const { createClient } = require('@supabase/supabase-js');

// Configuración (usar variables reales)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Clave de servicio (no anon)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno faltantes');
  console.log('Necesitas configurar:');
  console.log('- EXPO_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_KEY (service role key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lista de usuarios a crear
const users = [
  { email: 'lrazo@track-port.com', password: '123456', role: 'main_admin', name: 'Luis Razo' },
  { email: 'fanny@track-port.com', password: '123456', role: 'main_admin', name: 'Fanny' },
  { email: 'admin@track-port.com', password: '123456', role: 'main_admin', name: 'Admin Principal' },
  { email: 'ventas1@track-port.com', password: '123456', role: 'sales', name: 'Ventas 1' },
  { email: 'ventas2@track-port.com', password: '123456', role: 'sales', name: 'Ventas 2' },
  { email: 'sac1@track-port.com', password: '123456', role: 'customer_service', name: 'SAC 1' },
  { email: 'sac2@track-port.com', password: '123456', role: 'customer_service', name: 'SAC 2' },
  { email: 'aduana_lzo@track-port.com', password: '123456', role: 'customs_broker', name: 'Aduana LZO' }
];

async function createUsers() {
  console.log('🚀 Iniciando creación de usuarios TrackPort...');
  
  let created = 0;
  let errors = 0;

  for (const user of users) {
    try {
      console.log(`\n📝 Creando usuario: ${user.email}`);
      
      // Crear usuario
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          name: user.name,
          created_by: 'setup_script',
          created_at: new Date().toISOString()
        }
      });

      if (error) {
        console.log(`❌ Error creando ${user.email}: ${error.message}`);
        errors++;
      } else {
        console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
        created++;
      }

    } catch (err) {
      console.log(`❌ Error inesperado con ${user.email}: ${err.message}`);
      errors++;
    }

    // Pausa pequeña entre creaciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 RESUMEN:');
  console.log(`✅ Usuarios creados: ${created}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📱 Total procesados: ${users.length}`);

  if (created > 0) {
    console.log('\n🎉 ¡Usuarios creados exitosamente!');
    console.log('🌐 Pueden acceder en: https://www.track-port.com');
    console.log('🔑 Contraseña temporal para todos: 123456');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Verificar login de cada usuario');
    console.log('2. Enviar credenciales a cada persona');
    console.log('3. Solicitar cambio de contraseña en primer login');
  }
}

// Función para verificar usuarios existentes
async function listUsers() {
  console.log('📋 Verificando usuarios existentes...');
  
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.log('❌ Error obteniendo usuarios:', error.message);
    return;
  }

  console.log(`\n👥 Usuarios encontrados: ${data.users.length}`);
  
  data.users.forEach(user => {
    const role = user.user_metadata?.role || 'sin_rol';
    const name = user.user_metadata?.name || user.email.split('@')[0];
    console.log(`- ${user.email} (${role}) - ${name}`);
  });
}

// Ejecutar según argumento
const action = process.argv[2];

if (action === 'create') {
  createUsers();
} else if (action === 'list') {
  listUsers();
} else {
  console.log('📋 Script de gestión de usuarios TrackPort');
  console.log('\nUso:');
  console.log('  node create-users.js create  # Crear usuarios');
  console.log('  node create-users.js list    # Listar usuarios');
  console.log('\n⚠️  Requiere variables de entorno configuradas');
}