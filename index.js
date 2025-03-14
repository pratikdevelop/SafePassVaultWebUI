const { app, BrowserWindow, globalShortcut } = require('electron');
const url = require("url");
const path = require("path");
// const updateappelectron = require('update-electron-app')
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(path.join(__dirname, '/dist/safePassVault'), {
    electron: require(path.join(__dirname, 'node_modules', 'electron'))
  });
}

// updateappelectron.updateElectronApp();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webSecurity: false, // This can help for local file loading
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/safePassVault/browser/index.html'),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools initially if needed
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  // Register a global shortcut for toggling DevTools
  globalShortcut.register('Control+Shift+I', () => {
    if (mainWindow) {
      const isDevToolsOpened = mainWindow.webContents.isDevToolsOpened();
      if (isDevToolsOpened) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools();
      }
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Clean up global shortcut when quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
