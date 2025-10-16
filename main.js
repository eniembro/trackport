const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Mantener una referencia global del objeto ventana
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/images/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false // No mostrar hasta que esté listo
  });

  // Cargar la aplicación
  const startUrl = isDev 
    ? 'http://localhost:8081' 
    : `file://${path.join(__dirname, 'dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Abrir las herramientas de desarrollo en modo desarrollo
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitido cuando la ventana es cerrada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Configurar menú de aplicación
  const template = [
    {
      label: 'TrackPort',
      submenu: [
        {
          label: 'Acerca de TrackPort',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Servicios',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: 'Ocultar TrackPort',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Ocultar otros',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Mostrar todo',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Deshacer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Rehacer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Pegar', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Forzar recarga', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Herramientas de desarrollador', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Zoom real', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Acercar', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Alejar', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Pantalla completa', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Cerrar', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  // En macOS es común que las aplicaciones permanezcan activas
  // hasta que el usuario las cierre explícitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS es común recrear una ventana cuando se hace clic en el icono
  // del dock y no hay otras ventanas abiertas
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Configuración de seguridad
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    // Prevenir la apertura de nuevas ventanas
    navigationEvent.preventDefault();
  });

  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Permitir solo navegación dentro de la app
    if (parsedUrl.origin !== 'http://localhost:8081' && 
        parsedUrl.origin !== 'file://') {
      navigationEvent.preventDefault();
    }
  });
});