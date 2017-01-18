var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 900,
        center: true,
        icon: __dirname + "/app/img/is.png",
        //frame: false
    });

    mainWindow.setMinimumSize(800, 600);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.openDevTools();
    //anaPencere.setMenu(null);
    //anaPencere.setFullScreen(true);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});