const { app, BrowserWindow, screen, ipcMain } = require('electron')
const nodePath = require("path");

const createBrowserWindow = (mainWindow, width, height, url) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        autoHideMenuBar: true,
        minHeight: height / 2,
        minWidth: width / 2
    })

    win.loadURL(url, { userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:127.0) Gecko/20100101 Firefox/127.0' })
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
        webPreferences: {
            preload: nodePath.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false
        }
    })
    mainWindow.loadFile('main.html')
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
})
