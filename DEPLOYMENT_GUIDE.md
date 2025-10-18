# TrackPort - Guía de Deployment Web
## www.track-port.com

### 🎯 Estrategia de Deployment Recomendada

#### **Opción 1: Vercel (Recomendado para MVP)**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy desde el proyecto
cd "/Users/eniembro/visual studio trackport"
vercel

# 3. Configurar dominio personalizado en panel de Vercel
# - Agregar www.track-port.com
# - Configurar DNS del dominio
```

#### **Opción 2: Netlify**
```bash
# 1. Build del proyecto
npx expo export --platform web

# 2. Deploy a Netlify
# - Subir carpeta "dist" a Netlify
# - Configurar dominio personalizado
```

#### **Opción 3: AWS S3 + CloudFront**
```bash
# 1. Build del proyecto
npx expo export --platform web

# 2. Subir a S3
aws s3 sync dist/ s3://track-port-web --delete

# 3. Configurar CloudFront para SPA
```

### 🏗️ Configuración de Servidor Backend

#### **Supabase (Actual)**
- ✅ **Base de datos**: PostgreSQL en la nube
- ✅ **Autenticación**: JWT integrada
- ✅ **API**: REST y Real-time
- ✅ **Escalabilidad**: Automática
- ✅ **Costo**: Freemium, escalable

#### **Configuración de Dominio**
```
www.track-port.com → Web App (React Native Web)
api.track-port.com → Supabase (opcional, usa su URL)
admin.track-port.com → Panel de administración (opcional)
```

### 📱 Estrategia de Apps Móviles

#### **Apps Nativas (iOS/Android) - Solo para Admins**
```bash
# 1. Build para stores
npx expo build:ios    # App Store
npx expo build:android # Google Play

# 2. Publicación
# - Apple App Store (desarrollador empresarial)
# - Google Play Console (distribución privada)
```

#### **Progressive Web App (PWA) - Para Clientes**
```json
// app.json - Configuración PWA
{
  "expo": {
    "web": {
      "name": "TrackPort",
      "shortName": "TrackPort",
      "lang": "es",
      "scope": "/",
      "startUrl": "/",
      "display": "standalone",
      "orientation": "portrait",
      "themeColor": "#007AFF",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### 🔧 Variables de Entorno para Producción

```env
# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
EXPO_PUBLIC_APP_NAME=TrackPort
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_DOMAIN=https://www.track-port.com
```

### 🚀 Proceso de Deployment Automático

#### **GitHub Actions (Recomendado)**
```yaml
# .github/workflows/deploy.yml
name: Deploy TrackPort Web
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build web
        run: npx expo export --platform web
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./dist
```

### 💰 Costos Estimados

#### **Opción Económica (Recomendada)**
- **Hosting Web**: Vercel Free tier ($0/mes)
- **Backend**: Supabase Free tier ($0/mes hasta 500MB DB)
- **Dominio**: $12/año
- **Total**: ~$1/mes

#### **Opción Empresarial**
- **Hosting Web**: Vercel Pro ($20/mes)
- **Backend**: Supabase Pro ($25/mes)
- **Apps Nativas**: Apple Developer ($99/año) + Google Play ($25 único)
- **Total**: ~$50/mes

### 📊 Arquitectura Final

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Clientes      │    │    Admins       │    │    Backend      │
│                 │    │                 │    │                 │
│ Web App (PWA)   │◄──►│ Native Apps     │◄──►│   Supabase      │
│ www.track-port  │    │ iOS + Android   │    │   PostgreSQL    │
│                 │    │                 │    │   Auth + API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### ✅ Lista de Verificación Pre-Deployment

- [x] Build web generado sin errores
- [x] Logo SVG integrado correctamente
- [x] Variables de entorno configuradas
- [x] TypeScript compilando sin errores
- [x] GitHub repository configurado
- [ ] Dominio www.track-port.com adquirido
- [ ] Proveedor de hosting seleccionado
- [ ] DNS configurado
- [ ] SSL/HTTPS configurado
- [ ] Monitoring y analytics

### 🎯 Recomendación Final

Para el lanzamiento inmediato con clientes:

1. **Deploy web en Vercel** (gratuito, 5 minutos)
2. **Usar Supabase Free tier** (suficiente para comenzar)
3. **Apps nativas solo para admins** (distribución privada)
4. **PWA para clientes** (instalable desde web)

¿Procedemos con el deployment en Vercel?