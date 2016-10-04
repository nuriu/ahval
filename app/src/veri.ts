import { GitHub } from "./github";

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
        gitHubAktiflestir();
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
function gitHubAktiflestir() {
    let id: string;
    let secret: string;

    github = new GitHub();
    fs.readFile("ID", "utf8", (hata: any, veri: any) => {
        if (hata) {
            return console.log(hata);
        } else {
            id = veri;
            github.idBelirle(id);
            fs.readFile("SECRET", "utf8", (hata2: any, veri2: any) => {
                if (hata2) {
                    return console.log(hata2);
                } else {
                    secret = veri2;
                    github.secretBelirle(secret);

                    if (window.localStorage.getItem("githubtoken") === null) {
                        gitHubGirisYap(id, secret);
                    } else {
                        github.authenticate(window.localStorage.getItem("githubtoken"));
                        github.kullaniciyiGetir();
                    }
                }
            });
        }
    });
}

/**
 * Login with GitHub.
 * @param id Client ID.
 * @param secret Client Secret.
 */
function gitHubGirisYap(id: string, secret: string) {
    let secenekler = {
        istemci_id: id,
        istemci_sir: secret,
        kapsamlar: ["repo", "user", "notifications", "gist"],
    };

    let dogrulamaPenceresi = new BrowserWindow({
        center: true,
        height: 720,
        icon: __dirname + "/../img/is.png",
        show: false,
        width: 1200,
    });

    dogrulamaPenceresi.setMenu(null);

    let githubUrl = "https://github.com/login/oauth/authorize?";
    let dogrulamaUrl = githubUrl + "client_id=" + secenekler.istemci_id + "&scope=" + secenekler.kapsamlar;
    dogrulamaPenceresi.loadURL(dogrulamaUrl);
    dogrulamaPenceresi.show();

    function cagriylaIlgilen(url: string) {
        let hamKod = /code=([^&]*)/.exec(url) || null;
        let kod = (hamKod && hamKod.length > 1) ? hamKod[1] : null;
        let hata = /\?error=(.+)$/.exec(url);

        if (kod || hata) {
            dogrulamaPenceresi.destroy();
        }

        if (kod) {
            gitHubtanTokenIste(secenekler, kod);
        } else if (hata) {
            alert("Hata! GitHub üyeliğiniz ile giriş yapmalısınız. Lütfen tekrar deneyin.");
        }
    }

    dogrulamaPenceresi.webContents.on("will-navigate", (olay: any, url: string) => {
        cagriylaIlgilen(url);
    });

    dogrulamaPenceresi.webContents.on("did-get-redirect-request", (olay: any, eskiUrl: string, yeniUrl: string) => {
        cagriylaIlgilen(yeniUrl);
    });

    dogrulamaPenceresi.on("close", () => {
        dogrulamaPenceresi = null;
    });
}

/**
 * Get token from GitHub.
 * @param secenekler Options for auth.
 */
function gitHubtanTokenIste(secenekler: any, kod: any) {
    $.post("https://github.com/login/oauth/access_token", {
        client_id: secenekler.istemci_id,
        client_secret: secenekler.istemci_sir,
        code: kod,
    }).done((icerik: string, durum: string) => {
        /* token
        console.log(durum);
        console.log(icerik.slice(icerik.search("=") + 1, icerik.search("&")));
        */

        if (durum === "success") {
            window.localStorage.setItem("githubtoken", icerik.slice(icerik.search("=") + 1, icerik.search("&")));

            github.authenticate(icerik.slice(icerik.search("=") + 1, icerik.search("&")));

            github.kullaniciyiGetir();
        }
    });
}
