/// <reference path="../../typings/index.d.ts" />

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 900,
        center: true,
        icon: __dirname + "/../img/is.png"
    });

    mainWindow.setMinimumSize(1200, 700);
    mainWindow.loadURL(`file://${__dirname}/../ana.html`);

    mainWindow.webContents.openDevTools();
    //mainWindow.setMenu(null);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    };
});