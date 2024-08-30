const {app, BrowserWindow} = require('electron')
    const url = require("url");
    const path = require("path");
    if (process.env.NODE_ENV === 'development') {
      require('electron-reload')(path.join(__dirname, '/dist/password-app'), {
        electron: require(`${__dirname}/node_modules/electron`)
      });
    }
    
    let mainWindow


    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          devTools: true, 
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/password-app/browser/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }

    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })
app.whenReady().then(createWindow);