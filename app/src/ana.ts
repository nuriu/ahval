/// <reference path="../../typings/index.d.ts" />

var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

let anaPencere;

function createWindow() {
    anaPencere = new BrowserWindow({
        width: 1800,
        height: 900,
        center: true,
        icon: __dirname + "/../img/is.png"
    });

    anaPencere.setMinimumSize(1200, 700);
    anaPencere.loadURL(`file://${__dirname}/../ana.html`);

    anaPencere.webContents.openDevTools();
    anaPencere.setMenu(null);

    anaPencere.on('closed', function () {
        anaPencere = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', function () {
    if (anaPencere === null) {
        createWindow();
    };
});