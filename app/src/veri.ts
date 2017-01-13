import { GitHub } from "./github/github";

/**
 * File system.
 */
const fs = require("fs");
/**
 * Electron.
 */
const electron = require("electron");
/**
 * Electron remote.
 */
const remote = electron.remote;
/**
 * Main window.
 */
const BrowserWindow = remote.BrowserWindow;
/**
 * GitHub client.
 */
let github: GitHub;

$(document).ready(() => {
    document.getElementById("GitHub").addEventListener("click", () => {
        console.log("GitHub Seçildi!");
        activateGitHub();
    });

    document.getElementById("GitLab").addEventListener("click", () => {
        console.log("GitLab Seçildi!");
    });

    document.getElementById("Bitbucket").addEventListener("click", () => {
        console.log("Bitbucket Seçildi!");
    });

    document.getElementById("Trello").addEventListener("click", () => {
        console.log("Trello Seçildi!");
    });
});

/**
 * Activates GitHub.
 */
function activateGitHub() {
    let id: string;
    let secret: string;

    github = new GitHub();
    fs.readFile("keys/github/ID", "utf8", (hata: any, veri: any) => {
        if (hata) {
            return console.log(hata);
        } else {
            id = veri.trim();
            github.setID(id);
            fs.readFile("keys/github/SECRET", "utf8", (hata2: any, veri2: any) => {
                if (hata2) {
                    return console.log(hata2);
                } else {
                    secret = veri2.trim();
                    github.setSecret(secret);

                    if (window.localStorage.getItem("githubtoken") === null) {
                        loginWithGitHub(id, secret);
                    } else {
                        github.authenticate(window.localStorage.getItem("githubtoken"));
                        github.getUser();
                    }
                }
            });
        }
    });
}

/**
 * Login with GitHub.
 * @param id Client ID.
 * @param secret Client Secret Key.
 */
function loginWithGitHub(id: string, secret: string) {
    console.log(id, secret);

    let options = {
        clientID: id,
        clientSecret: secret,
        context: ["repo", "user", "notifications", "gist"],
    };

    let authWindow = new BrowserWindow({
        center: true,
        height: 720,
        icon: __dirname + "/../img/is.png",
        show: false,
        width: 1200,
    });

    authWindow.setMenu(null);

    let githubUrl = "https://github.com/login/oauth/authorize?";
    let authUrl = githubUrl + "client_id=" + options.clientID + "&scope=" + options.context;
    authWindow.loadURL(authUrl);
    authWindow.show();

    function handleCall(url: string) {
        let rawCode = /code=([^&]*)/.exec(url) || null;
        let kod = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
        let error = /\?error=(.+)$/.exec(url);

        if (kod || error) {
            authWindow.destroy();
        }

        if (kod) {
            getTokenFromGitHub(options, kod);
        } else if (error) {
            alert("Hata! GitHub üyeliğiniz ile giriş yapmalısınız. Lütfen tekrar deneyin.");
        }
    }

    authWindow.webContents.on("will-navigate", (olay: any, url: string) => {
        handleCall(url);
    });

    authWindow.webContents.on("did-get-redirect-request", (olay: any, eskiUrl: string, yeniUrl: string) => {
        handleCall(yeniUrl);
    });

    authWindow.on("close", () => {
        authWindow = null;
    });
}
/**
 * Get token from GitHub.
 * @param options Options for auth.
 */
function getTokenFromGitHub(options: any, kod: any) {
    $.post("https://github.com/login/oauth/access_token", {
        client_id: options.clientID,
        client_secret: options.clientSecret,
        code: kod,
    }).done((data: string, status: string) => {
        /*
        console.log(status);
        console.log(data.slice(data.search("=") + 1, data.search("&")));
        */

        if (status === "success") {
            window.localStorage.setItem("githubtoken", data.slice(data.search("=") + 1, data.search("&")));
            github.authenticate(data.slice(data.search("=") + 1, data.search("&")));
            github.getUser();
        }
    });
}

