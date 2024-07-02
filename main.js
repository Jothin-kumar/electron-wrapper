const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require('electron')
const nodePath = require("path");

if (!app.requestSingleInstanceLock()) {
    app.quit()
}

const createBrowserWindow = (mainWindow, width, height, url) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        autoHideMenuBar: true,
        minHeight: height / 2,
        minWidth: width / 2
    })

    win.loadURL(url, {userAgent: 'Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/122.0.6314.210 Chrome/122.0.6314.210 Safari/537.36'})
    win.on('closed', () => {
        mainWindow.show()
    })
}

PrimaryScreen = {}

app.whenReady().then(() => {
    PrimaryScreen.Resolution = screen.getPrimaryDisplay().workAreaSize
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        resizable: false,
        closable: false,
        icon: nodePath.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: nodePath.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false
        }
    })
    mainWindow.loadFile('main.html')
    app.on('second-instance', () => {
        mainWindow.show()
    })
    ipcMain.on('open-app', (evt, arg) => {
        mainWindow.hide()
        switch (arg) {
            case 'WhatsApp':
                createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://web.whatsapp.com')
                break
            case 'InstaGram':
                createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://instagram.com')
                break
            case 'SnapChat':
                createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://web.snapchat.com/')
                break
        }
    })
    ipcMain.on('to-tray', (evt, arg) => {
        mainWindow.hide()
    })

    const tray = new Tray(nodePath.join(__dirname, 'icon.png'))
    tray.setToolTip('Electron Wrapper')
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                mainWindow.focus()
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ]))
})
