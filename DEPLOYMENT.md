# 🚀 TrackPort - Deployment Multiplataforma

## 📱 **PLATAFORMAS SOPORTADAS**

TrackPort está configurado para funcionar en **todas las plataformas principales**:

- **🍎 macOS** - Aplicación nativa de escritorio
- **🪟 Windows** - Aplicación nativa de escritorio  
- **📱 iOS** - Aplicación móvil nativa
- **🤖 Android** - Aplicación móvil nativa
- **🌐 Web** - Aplicación web (navegador)

---

## 🛠️ **COMANDOS DE DESARROLLO**

### **🔧 Desarrollo Local**
```bash
# Iniciar en web (para desarrollo)
npm run dev:web

# Iniciar en iOS (requiere Xcode)
npm run ios

# Iniciar en Android (requiere Android Studio)
npm run android

# Iniciar aplicación desktop (Electron)
npm run dev:desktop
```

### **🏗️ Builds de Producción**

#### **📱 Móvil (iOS/Android)**
```bash
# Build Android APK
npm run build:android

# Build iOS IPA
npm run build:ios

# Build ambas plataformas móviles
npm run build:all
```

#### **🖥️ Desktop (macOS/Windows)**
```bash
# Build aplicación web primero
npm run build:web

# Build para macOS (desde macOS)
npm run package:mac

# Build para Windows (desde Windows/macOS con Wine)
npm run package:win

# Build para Linux
npm run package:linux

# Build desktop completo
npm run build:desktop
```

---

## 💻 **CONFIGURACIÓN POR PLATAFORMA**

### **🍎 macOS**
```bash
# Prerrequisitos
brew install node
npm install -g @expo/cli eas-cli

# Build nativo
npm run package:mac
# Genera: dist/TrackPort-1.0.0.dmg
```

### **🪟 Windows**
```bash
# Prerrequisitos (PowerShell como Admin)
winget install NodeJS.NodeJS
npm install -g @expo/cli eas-cli

# Build nativo
npm run package:win
# Genera: dist/TrackPort Setup 1.0.0.exe
```

### **📱 iOS**
```bash
# Prerrequisitos (solo macOS)
# Xcode 14+ instalado
# Apple Developer Account

# Build de desarrollo
eas build --platform ios --profile development

# Build de producción
eas build --platform ios --profile production
```

### **🤖 Android**
```bash
# Prerrequisitos
# Android Studio instalado
# Java JDK 17+

# Build APK de desarrollo
eas build --platform android --profile preview

# Build AAB de producción
eas build --platform android --profile production
```

---

## 📦 **DISTRIBUCIÓN**

### **🏪 App Stores**

#### **Apple App Store**
```bash
# Subir a TestFlight/App Store
eas submit --platform ios
```

#### **Google Play Store**
```bash
# Subir a Play Console
eas submit --platform android
```

### **💻 Distribución Desktop**

#### **macOS**
- **Archivo generado**: `TrackPort-1.0.0.dmg`
- **Distribución**: Notarización Apple, Mac App Store
- **Instalación**: Arrastrar a Aplicaciones

#### **Windows**
- **Archivo generado**: `TrackPort Setup 1.0.0.exe`
- **Distribución**: Microsoft Store, distribución directa
- **Instalación**: Ejecutar instalador

---

## 🔧 **CONFIGURACIÓN ESPECÍFICA**

### **Variables de Entorno**
```bash
# Crear archivo .env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NODE_ENV=production
```

### **Configuración EAS**
```bash
# Configurar proyecto EAS
eas init

# Configurar credenciales iOS
eas credentials

# Configurar credenciales Android
eas credentials --platform android
```

---

## 🚀 **DEPLOYMENT AUTOMATIZADO**

### **CI/CD con GitHub Actions**
```yaml
# .github/workflows/build.yml
name: Build All Platforms
on: [push]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build:all
```

### **Scripts de Deploy**
```bash
# Deploy completo (todas las plataformas)
npm run build:all

# Deploy solo móvil
npm run build:android && npm run build:ios

# Deploy solo desktop
npm run build:desktop
```

---

## 📊 **TAMAÑOS DE BUILD**

| Plataforma | Tamaño Estimado | Tiempo Build |
|------------|-----------------|--------------|
| **iOS IPA** | ~50-80 MB | 10-15 min |
| **Android APK** | ~30-50 MB | 8-12 min |
| **macOS DMG** | ~150-200 MB | 5-8 min |
| **Windows EXE** | ~130-180 MB | 5-8 min |
| **Web** | ~5-10 MB | 2-3 min |

---

## ✅ **CHECKLIST DE DEPLOYMENT**

### **Antes del Build**
- [ ] ✅ Configurar variables de entorno
- [ ] ✅ Actualizar versión en package.json
- [ ] ✅ Actualizar versión en app.json
- [ ] ✅ Probar en todas las plataformas localmente
- [ ] ✅ Configurar credenciales EAS

### **Builds Móviles**
- [ ] ✅ Configurar Apple Developer Account
- [ ] ✅ Configurar Google Play Console  
- [ ] ✅ Generar certificados iOS
- [ ] ✅ Generar keystore Android
- [ ] ✅ Probar en dispositivos físicos

### **Builds Desktop**
- [ ] ✅ Probar en macOS y Windows
- [ ] ✅ Verificar firmas de código
- [ ] ✅ Probar instalación/desinstalación
- [ ] ✅ Configurar auto-updater (opcional)

---

## 🆘 **TROUBLESHOOTING**

### **Errores Comunes**
```bash
# Error: Metro bundler
rm -rf node_modules && npm install

# Error: iOS certificates
eas credentials --platform ios --clear-all

# Error: Android build
eas build --platform android --clear-cache

# Error: Desktop build
rm -rf dist && npm run build:web
```

### **Logs útiles**
```bash
# Ver logs de build EAS
eas build:list

# Ver logs de submit
eas submit:list

# Debug local
npx expo start --tunnel
```

---

## 🎯 **RESULTADO FINAL**

Una vez completado el deployment, tendrás:

- **📱 Apps móviles** en App Store y Google Play
- **💻 Apps desktop** para macOS y Windows
- **🌐 Web app** accesible desde cualquier navegador
- **🔄 Sistema unificado** que funciona en todas las plataformas

**¡TrackPort estará disponible para todos tus usuarios, sin importar qué dispositivo usen!** 🚀✨