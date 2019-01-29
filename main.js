const setupEvents = require('./setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return
}

const { app, BrowserWindow, Notification, Tray, ipcMain } = require('electron')
const moment = require('moment')
const path = require('path')
const notifier = require('node-notifier')

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  })
}

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let mainWindow = undefined
let initialized = false

// Set app user model id to enable notifications on win
app.setAppUserModelId('org.develar.ElectronReact')

// Don't show the app in the doc
app.dock && app.dock.hide()

app.on('ready', function () {
  createTray()
  createWindow()
  initializeNotifications()
  showWindow()
  initialized = true
})

app.on('window-all-closed', function () {
  app.quit()
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
    },
    icon: path.join(assetsDirectory, 'app.ico')
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

      notifier.notify({
        title: `Queue by ${battle.kuski}`,
        message: `${battle.duration} minutes battle`
      })
    }

    if(battle.inqueue === 0 && battle.finished === 0 ) {
      const battleNotification = new Notification({
        title: `${battle.levelname} by ${battle.kuski}`,
        body: `${battle.duration} minutes battle started at ${moment(new Date((battle.started - 36000) * 1000)).format('MMM Do YY, H:mm:ss')}`
      }).show()

      notifier.notify({
        title: `${battle.levelname} by ${battle.kuski}`,
        message: `${battle.duration} minutes battle started at ${moment(new Date((battle.started - 36000) * 1000)).format('MMM Do YY, H:mm:ss')}`
      })
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
  if(!initialized) {
    mainWindow.setPosition(position.x, position.y, false)
  }
  mainWindow.show()
  mainWindow.focus()
}

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + (process.platform === "win32" ? windowBounds.width - 900 : trayBounds.height + 4))

  return { x, y }
}
