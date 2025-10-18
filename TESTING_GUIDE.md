# 🧪 TrackPort - Guía de Pruebas de Usuario

## 🔐 Usuarios de Prueba Disponibles

### 1. **Administrador Principal**
- **Email**: `admin@track-port.com`
- **Contraseña**: `admin123`
- **Rol**: `main_admin`
- **Acceso**: Dashboard completo, gestión de usuarios, reportes, todos los módulos

### 2. **Cliente Demo**
- **Email**: `cliente@track-port.com`
- **Contraseña**: `cliente123`
- **Rol**: `client`
- **Acceso**: Dashboard, contenedores propios, cartas de instrucción, pagos

### 3. **Servicio al Cliente**
- **Email**: `servicio@track-port.com`
- **Contraseña**: `servicio123`
- **Rol**: `customer_service`
- **Acceso**: Dashboard, gestión de clientes, validación de documentos

### 4. **Agente Aduanal**
- **Email**: `agente@track-port.com`
- **Contraseña**: `agente123`
- **Rol**: `customs_broker`
- **Acceso**: Dashboard, gestión aduanal, documentos de clearance

### 5. **Equipo de Ventas**
- **Email**: `ventas@track-port.com`
- **Contraseña**: `ventas123`
- **Rol**: `sales`
- **Acceso**: Dashboard, gestión de clientes, configuración de tarifas

## 🧪 Casos de Prueba

### Prueba 1: Login y Navegación
1. Abrir `http://localhost:8082`
2. Probar login con cualquier usuario
3. Verificar que aparecen las tabs correctas según el rol
4. Navegar entre secciones

### Prueba 2: Dashboard por Rol
1. Login como diferentes roles
2. Verificar que cada rol ve información diferente
3. Comprobar permisos de acceso

### Prueba 3: Funcionalidades Específicas
- **Cliente**: Ver contenedores, crear cartas de instrucción
- **Admin**: Acceso completo, reportes, gestión de usuarios
- **Servicio**: Validación de documentos, gestión de clientes

## ✅ Estado de Pruebas
- ✅ TypeScript: Sin errores
- ✅ Compilación: Exitosa
- ✅ Servidor Web: Funcionando en puerto 8082
- ✅ QR Code: Disponible para móvil
- 🔄 Pruebas de Usuario: En progreso

## 📱 Pruebas Móviles
Escanea el QR code mostrado en terminal con:
- **iOS**: Cámara nativa
- **Android**: Expo Go app

## 🌐 URL de Prueba
**Web**: http://localhost:8082