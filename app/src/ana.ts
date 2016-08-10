var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

let anaPencere: any;

function createWindow() {
    anaPencere = new BrowserWindow({
        width: 1800,
        height: 900,
        center: true,
        icon: __dirname + "/../img/is.png"
    });

    //anaPencere.setMinimumSize(1200, 700);
    anaPencere.loadURL(`file://${__dirname}/../ana.html`);

    anaPencere.webContents.openDevTools();
    //anaPencere.setMenu(null);

    anaPencere.on('closed', function () {
        anaPencere = null;
    });
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on("activate", () => {
    if (anaPencere === null) {
        createWindow();
    };
});