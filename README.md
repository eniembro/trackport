# TrackPort - Container Tracking & Customs Management# TrackPort - Container Tracking & Customs Management

## 🎯 Overview

TrackPort is a comprehensive **React Native + Expo + TypeScript** application for managing shipping containers and customs processes. Built with **Supabase** backend, it provides real-time tracking, document management, and role-based workflows for the logistics industry.

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **5 distinct user roles** with customized access:
  - `client` - Container owners, instruction letters
  - `customer_service` - Document validation, account management
  - `customs_broker` - Customs documents, clearance management
  - `sales` - Client management, rate configuration
  - `main_admin` - Full system access, reports, user management

### 📦 Container Tracking
- **15-stage status tracking** from booking to delivery
- **Real-time updates** with automatic notifications
- **ETA management** and location tracking
- **Document attachment** for each container

### 📝 Instruction Letter Management
- **7-status workflow** from draft to completed
- **Document upload** with file management
- **Client-specific delivery instructions**
- **Status tracking** and history

### 💰 Payment System
- **10 payment types** including customs fees, storage, handling
- **Receipt management** with document storage
- **Payment status tracking** (pending, paid, overdue)
- **Financial reporting** integration

### 📊 Advanced Reporting
- **Dashboard analytics** with real-time metrics
- **Excel export** functionality
- **Filtered reports** by date, status, client, payment type
- **Role-based report access**

### 👑 Admin Panel
- **User management** with CRUD operations
- **System statistics** and monitoring
- **Performance metrics** dashboard
- **Role-based administration**

## 🛠 Technical Stack

### Frontend
- **React Native 0.81.4** with Expo SDK 54
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Context** for state management

### Backend
- **Supabase PostgreSQL** with Row Level Security
- **Real-time subscriptions** for live updates
- **File storage** for documents
- **JWT authentication** with refresh tokens

### Development Tools
- **ESLint + Prettier** for code quality
- **TypeScript strict mode** for type safety
- **Expo Development Build** for testing
- **Git workflow** with feature branches

## 🚀 Quick Start

### Prerequisites
```bash
# Required tools
Node.js 18+
Expo CLI
Supabase account
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd trackport

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase URL and API keys

# Start development server
npm start
```

### Database Setup
1. Create a new **Supabase project**
2. Run `supabase/schema.sql` in the SQL editor
3. Run `supabase/seed.sql` for sample data
4. Configure **Row Level Security** policies
5. Update environment variables with your credentials

## 📱 App Structure

```
app/
├── (auth)/
│   ├── login.tsx         # Authentication screen
│   └── _layout.tsx       # Auth layout
├── (tabs)/
│   ├── index.tsx         # Dashboard
│   ├── containers.tsx    # Container management
│   ├── instructions.tsx  # Instruction letters
│   ├── payments.tsx      # Payment tracking
│   ├── clients.tsx       # Client management (sales role)
│   ├── admin.tsx         # Admin panel (main_admin)
│   ├── reports.tsx       # Reports & analytics
│   └── _layout.tsx       # Tab navigation
└── _layout.tsx           # Root layout
```

## 🔑 User Roles & Permissions

### Client Role
- View own containers and their status
- Create and manage instruction letters
- Upload required documents
- Track payment status

### Customer Service
- View all containers
- Validate and process documents
- Update container status
- Manage client accounts

### Customs Broker
- Access customs-related containers
- Upload customs documents
- Manage clearance process
- Update customs status

### Sales Role
- Manage client relationships
- Configure rates and pricing
- View sales analytics
- Client onboarding

### Main Admin
- Full system access
- User management (CRUD)
- System configuration
- Generate comprehensive reports

## 📊 Database Schema

### Core Tables
- **users** - Authentication and profiles
- **clients** - Client company information
- **containers** - Container tracking data
- **container_status_history** - Status change log
- **instruction_letters** - Delivery instructions
- **instruction_documents** - Document attachments
- **payments** - Payment tracking
- **payment_receipts** - Receipt storage

### Key Relationships
- Users belong to clients
- Containers belong to clients
- Instructions link to containers
- Payments link to containers
- Documents link to instructions/payments

## 🔒 Security Features

### Authentication
- **JWT tokens** with secure refresh
- **Role-based access** control
- **Session management** with auto-logout

### Database Security
- **Row Level Security** on all tables
- **Role-based policies** for data access
- **Secure file uploads** with validation
- **Audit logging** for critical operations

## 📈 Performance Features

### Optimization
- **Lazy loading** for large datasets
- **Pagination** for container lists
- **Image optimization** for mobile
- **Efficient Supabase queries**

### Real-time Updates
- **WebSocket connections** for live data
- **Optimistic updates** for better UX
- **Background sync** for offline support
- **Push notifications** for status changes

## 🎨 UI/UX Design

### Design System
- **Consistent color palette** with brand colors
- **Responsive layouts** for all screen sizes
- **Accessibility features** with screen reader support
- **Loading states** and error handling

### Navigation
- **Tab-based navigation** for main features
- **Stack navigation** for detailed views
- **Role-based menu** showing relevant options
- **Deep linking** support

## 📖 API Documentation

### Supabase Services
```typescript
// Authentication
auth.signIn(email, password)
auth.signOut()
auth.getUser()

// Containers
containers.getAll()
containers.getById(id)
containers.create(data)
containers.update(id, data)

// Instructions
instructionLetters.getAll()
instructionLetters.create(data)

// Payments
payments.getAll()
payments.create(data)
```

### Real-time Subscriptions
```typescript
// Listen to container updates
supabase
  .channel('containers')
  .on('postgres_changes', 
     { event: '*', schema: 'public', table: 'containers' },
     handleContainerUpdate
  )
  .subscribe()
```

## 🧪 Testing Strategy

### Manual Testing
- **Role-based testing** for each user type
- **Workflow validation** for critical paths
- **Cross-platform testing** (iOS/Android)
- **Performance testing** under load

### Quality Assurance
- **TypeScript compilation** catches type errors
- **ESLint rules** enforce code standards
- **Code review** process for all changes
- **User acceptance testing** before deployment

## 📦 Deployment

### Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Production Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Environment Configuration
```bash
# Production environment variables
EXPO_PUBLIC_SUPABASE_URL=your_production_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. Create a **feature branch**
3. Make your changes with **tests**
4. Submit a **pull request**

### Code Standards
- **TypeScript** for all new code
- **ESLint** configuration compliance
- **Component documentation** for complex components
- **Commit message** conventions

## 📞 Support

### Documentation
- **API Reference** in `docs/api.md`
- **User Guide** in `docs/user-guide.md`
- **Deployment Guide** in `docs/deployment.md`

### Community
- **GitHub Issues** for bug reports
- **GitHub Discussions** for questions
- **Email Support** for enterprise users

## 🏆 Project Status

### ✅ Completed Features
- ✅ Multi-role authentication system
- ✅ Container tracking with 15 statuses
- ✅ Instruction letter management
- ✅ Payment tracking system
- ✅ Admin panel with user management
- ✅ Advanced reporting with Excel export
- ✅ Real-time data synchronization
- ✅ File upload and storage
- ✅ Role-based navigation
- ✅ Dashboard analytics

### 🚀 Ready for Production
TrackPort is **feature-complete** and ready for production deployment with:
- Comprehensive business logic
- Secure authentication system
- Real-time data synchronization
- Professional UI/UX design
- Scalable architecture
- Production-ready code quality

---

**TrackPort v1.0.0** - *Revolutionizing Container Tracking & Customs Management* 📦✈️🚢

Built with ❤️ using React Native, Expo, TypeScript, and Supabase.



## 📱 Descripción del Proyecto<div align="center">

  <img src="./assets/trackport-logo.png" alt="TrackPort Logo" width="200" height="200">

TrackPort es una aplicación móvil desarrollada en React Native + Expo para la gestión y seguimiento de contenedores marítimos y procesos aduaneros. La aplicación proporciona una solución integral para clientes, agentes aduanales, personal de servicio al cliente, equipos de ventas y administradores.  

  **Tu socio confiable en logística internacional**

### ✨ Características Principales  

  [www.track-port.com](https://www.track-port.com) | [admin@track-port.com](mailto:admin@track-port.com)

- **Seguimiento de Contenedores**: 15 estados diferentes del proceso logístico</div>

- **Sistema de Roles**: 5 roles distintos con permisos específicos

- **Cartas de Instrucción**: Gestión completa de documentación🚢 **Sistema completo de gestión aduanera y seguimiento de contenedores**

- **Sistema de Pagos**: 10 tipos de pago con recibos digitales

- **Panel Administrativo**: Control total del sistema## 🎯 Descripción

- **Backend en Tiempo Real**: Integración con Supabase

- **Reportes Avanzados**: Exportación a Excel y analyticsTrackPort es una aplicación móvil desarrollada en React Native + Expo + TypeScript para la gestión integral de contenedores y procesos aduanales. Diseñada para empresas de logística que necesitan un control completo sobre el flujo de mercancías desde el puerto hasta la entrega final.

- **Autenticación Segura**: Sistema completo de login/registro

## 🎨 Identidad Visual

## 🏗️ Arquitectura Técnica

### Logo Oficial

### Stack Tecnológico- **Diseño**: Contenedor con grúa portuaria

- **Frontend**: React Native + Expo SDK 54- **Colores principales**: 

- **Lenguaje**: TypeScript  - Azul principal: `#1e3a8a`

- **Navegación**: Expo Router (file-based routing)  - Azul secundario: `#3b82f6` 

- **Backend**: Supabase (PostgreSQL + Auth + Storage)  - Azul contenedor: `#93c5fd`

- **Base de Datos**: PostgreSQL con RLS (Row Level Security)

- **Tiempo Real**: Supabase Realtime## 🏗️ Arquitectura

- **Almacenamiento**: Supabase Storage para documentos

- **Frontend**: React Native + Expo

### Estructura del Proyecto- **Lenguaje**: TypeScript

```- **Backend**: Supabase (PostgreSQL + Tiempo Real)

trackport/- **Navegación**: Expo Router (file-based routing)

├── app/                     # Pantallas de la aplicación- **Estado**: Context API

│   ├── (auth)/             # Flujo de autenticación- **Autenticación**: Supabase Auth + AsyncStorage

│   ├── (tabs)/             # Navegación principal

│   └── _layout.tsx         # Layout principal## 👥 Sistema de Roles (5 Módulos)

├── components/             # Componentes reutilizables

├── contexts/              # Contextos de React### 1. 👤 **Cliente** (`client`)

├── services/              # Servicios y APIs- Ver contenedores propios

├── types/                 # Definiciones de TypeScript- Crear cartas de instrucciones

├── utils/                 # Utilidades y configuración- Subir comprobantes de pago

├── assets/                # Recursos estáticos- Seguimiento en tiempo real

└── supabase/              # Scripts de base de datos

```### 2. 🎧 **SAC - Servicio al Cliente** (`customer_service`)

- Validar documentos

## 👥 Sistema de Roles- Gestionar cuentas bancarias

- Aprobar/rechazar cartas

### 1. Client (Cliente)- Coordinar con navieras

- **Acceso**: Contenedores propios, instrucciones, pagos

- **Funciones**: Crear cartas de instrucción, subir documentos, ver pagos### 3. 🏛️ **Agencia Aduanal** (`customs_broker`)

- **Navegación**: Dashboard, Contenedores, Cartas, Pagos, Acerca de- Subir proformas y pedimentos

- Gestionar documentos aduanales

### 2. Customer Service (Servicio al Cliente)- Reportar revisiones

- **Acceso**: Todos los contenedores, validación de documentos- Coordinar despachos

- **Funciones**: Gestión de clientes, validación, soporte

- **Navegación**: Dashboard, Contenedores, Clientes, Soporte, Acerca de### 4. 💼 **Ventas** (`sales`)

- Crear usuarios cliente

### 3. Customs Broker (Agente Aduanal)- Configurar tarifas

- **Acceso**: Documentos aduaneros, trámites de aduana- Gestionar rates por cliente

- **Funciones**: Subir documentos aduaneros, gestión de permisos- Reportes comerciales

- **Navegación**: Dashboard, Contenedores, Documentos, Aduana, Acerca de

### 5. ⚙️ **Admin Principal** (`main_admin`)

### 4. Sales (Ventas)- Control total del sistema

- **Acceso**: Gestión de clientes, reportes comerciales- Reportes y métricas

- **Funciones**: Prospección, tarifas, reportes de ventas- Gestión de usuarios

- **Navegación**: Dashboard, Clientes, Prospectos, Reportes, Acerca de- Configuración de costos



### 5. Main Admin (Administrador Principal)## 📱 Funcionalidades Principales

- **Acceso**: Control total del sistema

- **Funciones**: Gestión de usuarios, configuración, reportes ejecutivos### ✅ Gestión de Contenedores

- **Navegación**: Dashboard, Contenedores, Admin, Reportes, Acerca de- **15 estados diferentes** (arribo → despacho → salida)

- Timeline visual de progreso

## 📊 Estados de Contenedores (15 Estados)- Documentos asociados

- Costos detallados por concepto

1. **pending** - Pendiente de llegada

2. **in_port** - En puerto### ✅ Cartas de Instrucciones

3. **customs_pending** - Pendiente de aduana- **3 tipos de servicio**:

4. **customs_approved** - Aprobado por aduana  - Asesoría solamente

5. **in_transit** - En tránsito  - Despacho + Agencia (encargo conferido)

6. **delivered** - Entregado  - Despacho + Agencia + Comercializadora

7. **returned** - Devuelto- Múltiples tipos de mercancía

8. **damaged** - Dañado- Carga de documentos (factura, B/L, packing list)

9. **lost** - Perdido- Validación por SAC

10. **on_hold** - En espera

11. **inspection_required** - Requiere inspección### ✅ Sistema de Pagos

12. **documentation_incomplete** - Documentación incompleta- **10 tipos de pago**: impuestos, agencia, comercializadora, etc.

13. **payment_pending** - Pago pendiente- Carga de comprobantes

14. **released** - Liberado- Validación automática

15. **archived** - Archivado- Historial completo



## 📋 Sistema de Cartas de Instrucción### ✅ Dashboard por Roles

- Métricas personalizadas según rol

### Estados de Instrucciones (7 Estados)- Acciones rápidas contextuales

- **draft** - Borrador- Notificaciones en tiempo real

- **pending_review** - Pendiente de revisión- Reportes específicos

- **approved** - Aprobada

- **rejected** - Rechazada## 🚀 Instalación y Setup

- **in_process** - En proceso

- **completed** - Completada### Prerrequisitos

- **cancelled** - Cancelada```bash

# Instalar Node.js (v18+)

### Tipos de Documentoscurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

- **invoice** - Factura comercialnvm install --lts

- **packing_list** - Lista de empaque

- **bill_of_lading** - Conocimiento de embarque# Instalar Bun (opcional pero recomendado)

- **certificate** - Certificadoscurl -fsSL https://bun.sh/install | bash

- **permit** - Permisos

- **other** - Otros documentos# Instalar Expo CLI

npm install -g @expo/cli

## 💰 Sistema de Pagos```



### Tipos de Pago (10 Tipos)### Configuración del Proyecto

1. **port_fees** - Tarifas portuarias```bash

2. **customs_duties** - Aranceles aduaneros# Clonar el repositorio

3. **storage_fees** - Tarifas de almacenajegit clone https://github.com/eniembro/rork-container-tracking-and-customs-management-app.git

4. **handling_charges** - Cargos de manejocd trackport

5. **documentation_fees** - Tarifas de documentación

6. **inspection_fees** - Tarifas de inspección# Instalar dependencias

7. **demurrage** - Sobrestadíabun install  # o npm install

8. **detention** - Detención

9. **transport_costs** - Costos de transporte# Configurar variables de entorno

10. **other_charges** - Otros cargoscp .env.example .env

# Editar .env con tus credenciales de Supabase

### Estados de Pago (6 Estados)

- **pending** - Pendiente# Iniciar servidor de desarrollo

- **partial** - Parcialbun run start  # o npx expo start

- **paid** - Pagado```

- **overdue** - Vencido

- **cancelled** - Cancelado### Variables de Entorno (.env)

- **refunded** - Reembolsado```env

EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url

### Niveles de PrioridadEXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

- **low** - Baja```

- **medium** - Media

- **high** - Alta## 🧪 Testing

- **urgent** - Urgente

### Usuarios de Prueba

## 🗄️ Base de Datos| Email | Contraseña | Rol |

|-------|------------|-----|

### Tablas Principales| `admin@trackport.com` | `password` | Admin Principal |

| `cliente@test.com` | `password` | Cliente |

#### users| `sac@trackport.com` | `password` | SAC |

```sql| `agencia@test.com` | `password` | Agencia Aduanal |

- id (UUID, PK)| `ventas@trackport.com` | `password` | Ventas |

- email (VARCHAR, UNIQUE)

- name (VARCHAR)### Comandos de Desarrollo

- role (ENUM)```bash

- company (VARCHAR)# Desarrollo web

- phone (VARCHAR)bun run web

- status (ENUM)

- created_at, updated_at# iOS (requiere Xcode)

```bun run ios



#### containers# Android (requiere Android Studio)

```sqlbun run android

- id (UUID, PK)

- number (VARCHAR, UNIQUE)# Verificar TypeScript

- type (ENUM: dry, reefer, open_top, flat_rack, tank)bun run tsc --noEmit

- size (ENUM: 20, 40, 45)```

- status (ENUM)

- origin_port, destination_port## 📊 Base de Datos

- arrival_date

- client_id (FK → users)### Tablas Principales

- created_at, updated_at- `users` - Usuarios del sistema

```- `containers` - Contenedores y su estado

- `instruction_letters` - Cartas de instrucciones

#### instruction_letters- `client_rates` - Tarifas por cliente

```sql- `payment_receipts` - Comprobantes de pago

- id (UUID, PK)

- container_id (FK → containers)### Relaciones

- client_id (FK → users)- Usuario → Cliente (1:N)

- title, description- Cliente → Contenedores (1:N)

- status, priority- Contenedor → Carta Instrucciones (N:1)

- shipment_info (JSONB)- Cliente → Tarifas (1:1)

- cargo_info (JSONB)

- special_instructions## 🏢 Flujo de Trabajo

- created_at, updated_at

```### 1. Proceso Inicial

1. **VENTAS** crea cliente y configura tarifas

#### payments2. **ADMIN** aprueba las tarifas

```sql3. **Cliente** recibe acceso al sistema

- id (UUID, PK)

- container_id (FK → containers)### 2. Carta de Instrucciones

- client_id (FK → users)1. **Cliente** crea carta y sube documentos

- instruction_id (FK → instruction_letters)2. **SAC** valida documentos

- type, amount, currency3. **SAC** aprueba carta de instrucciones

- status, priority

- due_date, paid_date### 3. Proceso Aduanal

- description1. **Agencia** sube proforma con impuestos

- created_at, updated_at2. **Cliente** paga impuestos y sube comprobante

```3. **Agencia** genera pedimento pagado

4. **SAC** coordina fechas de despacho

## 📈 Sistema de Reportes

## 🚀 Deployment

### Tipos de Reportes

- **Resumen General** - Métricas ejecutivas### Desarrollo Local

- **Contenedores** - Análisis de contenedores```bash

- **Pagos** - Reportes financieros# Tunnel público para testing en dispositivos

- **Instrucciones** - Gestión documentalnpx expo start --tunnel

- **Clientes** - Performance por cliente

- **Ingresos** - Análisis de revenue# Solo red local

npx expo start --lan

### Métricas Principales```

- Total de contenedores

- Contenedores activos### Build de Producción

- Pagos pendientes```bash

- Ingresos totales# Android APK

- Tiempo promedio de procesamientonpx eas build --platform android

- Distribución de estados

# iOS (requiere Apple Developer Account)

### Exportaciónnpx eas build --platform ios

- **Excel (.xlsx)** - Hojas de cálculo completas

- **Filtros avanzados** - Por fecha, estado, cliente# Build universal

- **Gráficos** - Visualización de datosnpx eas build --platform all

- **Compartir** - Integración nativa```



## 🔧 Configuración de Desarrollo## 📱 Compatibilidad



### Prerequisitos- ✅ **iOS**: 13.0+

- Node.js 18+- ✅ **Android**: API 21+ (Android 5.0+)

- Expo CLI- ✅ **Web**: Navegadores modernos

- Cuenta de Supabase (opcional)- ✅ **Responsive**: Tablets y móviles



### Instalación## 🔧 Stack Tecnológico

```bash

# Clonar repositorio| Categoría | Tecnología |

git clone [repo-url]|-----------|------------|

cd trackport| **Frontend** | React Native + Expo |

| **Lenguaje** | TypeScript |

# Instalar dependencias| **Backend** | Supabase |

npm install| **Base de Datos** | PostgreSQL |

| **Tiempo Real** | Supabase Realtime |

# Configurar variables de entorno| **Autenticación** | Supabase Auth |

cp .env.example .env| **Navegación** | Expo Router |

# Editar .env con tus configuraciones| **Íconos** | Emojis nativos |

| **Documentos** | Expo Document Picker |

# Iniciar desarrollo| **Reportes** | SheetJS (XLSX) |

npm start

```## 📝 Documentación Adicional



### Variables de Entorno- [Configuración de Supabase](./SUPABASE_SETUP.md)

```bash- [Estructura de Módulos](./FASE_1_MODULOS.md)

EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co- [Setup de Backend](./BACKEND_CONFIGURADO.md)

EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima- [Configuración GitHub](./GITHUB_SETUP.md)

EXPO_PUBLIC_APP_NAME=TrackPort

EXPO_PUBLIC_APP_VERSION=1.0.0## 🤝 Contribuciones

```

1. Fork el proyecto

### Configuración de Supabase2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)

1. Crear proyecto en [supabase.com](https://supabase.com)3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)

2. Ejecutar `supabase/schema.sql` en SQL Editor4. Push a la rama (`git push origin feature/AmazingFeature`)

3. Ejecutar `supabase/seed.sql` para datos de ejemplo5. Abre un Pull Request

4. Configurar buckets de Storage: `documents`, `receipts`, `avatars`

5. Actualizar variables de entorno## 📄 Licencia



## 🧪 Testing y DesarrolloEste proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.



### Usuarios de Prueba## ��‍💻 Desarrollador

```

admin@track-port.com / 123456 (main_admin)**ENIEMBRO** - Desarrollador Full Stack  

cliente@track-port.com / 123456 (client)📧 Email: [contacto](mailto:contacto@trackport.com)  

servicio@track-port.com / 123456 (customer_service)🐙 GitHub: [@eniembro](https://github.com/eniembro)

agente@track-port.com / 123456 (customs_broker)

ventas@track-port.com / 123456 (sales)---

```

⭐ **¡Dale una estrella si este proyecto te fue útil!**

### Funcionalidades Implementadas

#### ✅ Fase 1: Fundación
- [x] Configuración inicial del proyecto
- [x] Estructura de navegación
- [x] Sistema de autenticación
- [x] Tipos básicos de TypeScript

#### ✅ Fase 2: Roles y Navegación
- [x] Sistema de roles completo
- [x] Navegación dinámica por rol
- [x] Contexto de autenticación
- [x] Pantallas base para cada rol

#### ✅ Fase 3: Gestión de Contenedores
- [x] CRUD completo de contenedores
- [x] 15 estados diferentes
- [x] Filtros y búsqueda
- [x] UI responsiva

#### ✅ Fase 4: Actualización de Marca
- [x] Branding oficial TrackPort
- [x] Logo corporativo
- [x] Colores y tipografía
- [x] Configuración de app

#### ✅ Fase 5: Sistema de Instrucciones
- [x] Cartas de instrucción completas
- [x] 7 estados de workflow
- [x] Gestión de documentos
- [x] Validación y aprobación

#### ✅ Fase 6: Sistema de Pagos
- [x] 10 tipos de pago
- [x] 6 estados de pago
- [x] Gestión de recibos
- [x] Prioridades y vencimientos

#### ✅ Fase 7: Panel de Administración
- [x] Dashboard administrativo
- [x] Gestión de usuarios
- [x] Configuración del sistema
- [x] Métricas en tiempo real

#### ✅ Fase 8: Integración Supabase
- [x] Backend completo
- [x] Base de datos PostgreSQL
- [x] Autenticación
- [x] Row Level Security
- [x] Storage para archivos
- [x] Tiempo real

#### ✅ Fase 9: Reportes y Exportación
- [x] Sistema de reportes avanzado
- [x] Exportación a Excel
- [x] Dashboard widgets
- [x] Filtros avanzados
- [x] Métricas ejecutivas

#### 🔄 Fase 10: Testing y Deployment (En Progreso)
- [ ] Suite de testing
- [ ] Optimización de performance
- [ ] Builds de producción
- [ ] CI/CD pipeline
- [ ] Documentación técnica

## 🚀 Builds y Deployment

### Desarrollo
```bash
npm start                    # Expo Dev Server
npx expo start --tunnel     # Túnel público
```

### Builds de Producción
```bash
npx expo build:android     # Build Android
npx expo build:ios         # Build iOS
```

### Configuración de CI/CD
- GitHub Actions configurado
- Builds automáticos
- Testing automático
- Deploy a stores

## 📚 Documentación Adicional

- [Configuración de Supabase](./supabase/README.md)
- [Guía de Desarrollo](./docs/development.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**TrackPort Team**
- Website: [www.track-port.com](https://www.track-port.com)
- Email: admin@track-port.com
- Soporte: soporte@track-port.com

---

**TrackPort v1.0.0** - Sistema Integral de Gestión de Contenedores y Aduanas