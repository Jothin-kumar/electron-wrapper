const { app, BrowserWindow, screen } = require('electron')

const createBrowserWindow = (width, height, url) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        autoHideMenuBar: true,
    })

    win.loadURL(url, { userAgent: 'Mozilla/5.0 (X11; Linux i686; rv:127.0) Gecko/20100101 Firefox/127.0' })
}

app.whenReady().then(() => {
    const { screenWidth, screenHeight } = screen.getPrimaryDisplay().workAreaSize
    if (screenWidth < 1000 || screenHeight < 690) {
        app.quit()
    }
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        resizable: false
    })
    mainWindow.loadFile('main.html')
})