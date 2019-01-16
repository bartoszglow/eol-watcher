const { app, BrowserWindow, Notification, Tray, ipcMain } = require('electron')
const moment = require('moment')
const path = require('path')

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  })
}

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let mainWindow = undefined

// Set app user model id to enable notifications on win
app.setAppUserModelId('org.develar.ElectronReact')

// Don't show the app in the doc
app.dock && app.dock.hide()

app.on('ready', function () {
  createTray()
  createWindow()
  initializeNotifications()
})

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 470,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false
    }
  })

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools({ mode: 'detach' })
    mainWindow.loadURL(`http://localhost:3000`)
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }

  // Hide the window when it loses focus
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'eol.png'))
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()
  
    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({mode: 'detach'})
    }
  })
}

const initializeNotifications = () => {
  ipcMain.on('battle', (event, battle) => {
    if(battle.inqueue) {
      const battleNotification = new Notification({
        title: `Queue by ${battle.kuski}`,
        body: `${battle.duration} minutes battle`
      }).show()
    }

    if(battle.inqueue === 0 && battle.finished === 0 ) {
      const battleNotification = new Notification({
        title: `${battle.levelname} by ${battle.kuski}`,
        body: `${battle.duration} minutes battle started at ${moment(new Date((battle.started - 36000) * 1000)).format('MMM Do YY, H:mm:ss')}`
      }).show()
    }
  })
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
  mainWindow.focus()
}

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + (process.platform === "win32" ? -trayBounds.height - 4: trayBounds.height + 4))

  return { x, y }
}
