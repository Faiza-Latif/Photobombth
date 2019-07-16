const electron = require('electron');
const images = require('./images')
const menuTemplate = require('./menu')
const { app, BrowserWindow, ipcMain: ipc, Menu} = electron;

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        resizable: false,
        height: 725,
        width: 1200,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    mainWindow.loadURL(`file://${__dirname}/capture.html`)
    mainWindow.webContents.openDevTools()

    images.mkdir(images.getPicturesDir(app))
    mainWindow.on('closed', _ => {
        mainWindow = null;
    })
    const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow))
    Menu.setApplicationMenu(menuContents)
})

ipc.on('image-captured', (evt, contents) => {
    images.save(images.getPicturesDir(app),contents, (err, imgPath) => {
        images.cache(imgPath);
    })
})

ipc.on('image-remove', (evt, index) => {
    images.remove(index, _ => {
        //send an event to the sender of the event
        evt.sender.send('image-removed', index)
    })
})