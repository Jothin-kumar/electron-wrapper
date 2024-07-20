const { app, BrowserWindow, screen, ipcMain} = require('electron')
const nodePath = require("path");
const shell = require('electron').shell

if (!app.requestSingleInstanceLock()) {
    app.quit()
}

function showAndFocus(window) {
    window.show()
    window.focus()
}

const createBrowserWindow = (mainWindow, width, height, url) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        autoHideMenuBar: true,
        minHeight: height / 2,
        minWidth: width / 2,
        show: false
    })

    win.loadURL(url, {userAgent: 'Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/122.0.6314.210 Chrome/122.0.6314.210 Safari/537.36'})
    const f = (evt) => {
        evt.preventDefault()
        win.hide()
        showAndFocus(mainWindow)
    }
    win.on('close', f)
    win.on('minimize', f)
    win.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    return win
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
        showAndFocus(mainWindow)
    })
    mainWindow.on('close', (evt) => {
        evt.preventDefault()
        mainWindow.hide()
    })
    const WhatsApp = createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://web.whatsapp.com')
    const InstaGram = createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://instagram.com')
    const SnapChat = createBrowserWindow(mainWindow, PrimaryScreen.Resolution.width, PrimaryScreen.Resolution.height, 'https://web.snapchat.com/')
    ipcMain.on('open-app', (evt, arg) => {
        mainWindow.hide()
        switch (arg) {
            case 'WhatsApp':
                showAndFocus(WhatsApp)
                break
            case 'InstaGram':
                showAndFocus(InstaGram)
                break
            case 'SnapChat':
                showAndFocus(SnapChat)
                break
        }
    })
    ipcMain.on('hide', (evt, arg) => {
        mainWindow.hide()
    })
})
