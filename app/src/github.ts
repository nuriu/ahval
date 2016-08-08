/// <reference path="../../typings/index.d.ts" />

var fs = require("fs");
var SQL = require("sql.js");
var GitHub = require('github-api');
var request = require("superagent");
var electron = window.require('electron');
var ipcRenderer = window.require('electron').ipcRenderer;
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

var gh: any;
var KULLANICI: any;
var PROJELER: any;
var fb2 = fs.readFileSync(`${__dirname}/db/id.ajanda`);
var db2 = new SQL.Database(fb2);
var aktifProje: string;

$(document).ready(function () {
    document.getElementById("projeListesi").innerHTML = "\
    <li class='active' id='tumIsler' onclick='aktifProjeyiDegistir(this.id)'>\
    <a href='#'><i class='browser icon'></i> Tüm İşler</a></li>";

    aktifProje = "tumIsler";

    if (!window.localStorage.getItem("githubtoken")) {
        gitHubGirisYap();
    } else {
        gh = new GitHub({
            token: window.localStorage.getItem("githubtoken")
        });
        bilgileriYazdir();
    }

});

function gitHubGirisYap() {
    let self = this;
    let secenekler = {
        istemci_id: db2.exec("SELECT * FROM AJANDA")[0].values[0][0],
        istemci_sir: db2.exec("SELECT * FROM AJANDA")[0].values[0][1],
        kapsamlar: ["repo", "user", "notifications", "gist"]
    };

    let dogrulamaPenceresi = new BrowserWindow({
        width: 1200,
        height: 720,
        show: false,
        'node-integration': false,
        center: true,
        icon: __dirname + "/../img/is.png"
    });

    dogrulamaPenceresi.setMenu(null);

    let githubUrl = "https://github.com/login/oauth/authorize?";
    let dogrulamaUrl = githubUrl + "client_id=" + secenekler.istemci_id + "&scope=" + secenekler.kapsamlar;
    dogrulamaPenceresi.loadURL(dogrulamaUrl);
    dogrulamaPenceresi.show();

    function cagriylaIlgilen(url: string) {
        let ham_kod = /code=([^&]*)/.exec(url) || null;
        let kod = (ham_kod && ham_kod.length > 1) ? ham_kod[1] : null;
        let hata = /\?error=(.+)$/.exec(url);

        if (kod || hata) {
            dogrulamaPenceresi.destroy();
        }

        if (kod) {
            self.GitHubtanTokenIste(secenekler, kod);
        } else if (hata) {
            alert("Hata! GitHub üyeliğiniz ile giriş yapmalısınız. Lütfen tekrar deneyin.");
        }
    }

    dogrulamaPenceresi.webContents.on("will-navigate", function (olay: any, url: string) {
        cagriylaIlgilen(url);
    });

    dogrulamaPenceresi.webContents.on("did-get-redirect-request", function (olay: any, eskiUrl: string, yeniUrl: string) {
        cagriylaIlgilen(yeniUrl);
    });

    dogrulamaPenceresi.on("close", function () {
        dogrulamaPenceresi = null;
    }, false);
}

function GitHubtanTokenIste(secenekler: any, kod: any) {
    request
        .post("https://github.com/login/oauth/access_token", {
            client_id: secenekler.istemci_id,
            client_secret: secenekler.istemci_sir,
            code: kod,
        })
        .end(function (hata: string, cevap: any) {
            if (cevap && cevap.ok) {
                window.localStorage.setItem("githubtoken", cevap.body.access_token);

                gh = new GitHub({
                    token: cevap.body.access_token
                });

                bilgileriYazdir();

            } else {
                console.log(hata);
            }
        });
}

function bilgileriYazdir() {
    gh.getUser().getProfile(function (hata: string, icerik: Object) {
        KULLANICI = icerik;
        gitHubProfilBilgileriniYazdir();
    });

    gh.getUser().listRepos({
        type: "all",
        sort: "full_name",
        direction: "asc"
    }, function (hata: string, icerik: Object) {
        PROJELER = icerik;
        gitHubProjeListesiniYazdir();
    });

}

function gitHubProfilBilgileriniYazdir() {
    if (KULLANICI) {
        document.getElementById("github").innerHTML = "<div class='ui list'><div class='item'>\
        <img class='ui tiny avatar image' src='"+ KULLANICI.avatar_url + "'>\
        <div class='content'>\
        <span class='header'>" + KULLANICI.name + "</span>\
        <div class='description'><i class='github icon'></i>" + KULLANICI.login + "<br>"
            + KULLANICI.bio + "<br>"
            + KULLANICI.company + "</div>\
        </div></div></div>";
        document.getElementById("github").innerHTML += "<br><div class='ui tiny three statistics'>\
        <div class='statistic'><div class='value'>" + KULLANICI.public_repos + "</div>\
        <div class='label'>PROJE</div></div>\
        <div class='statistic'><div class='value'>" + KULLANICI.followers + "</div>\
        <div class='label'>TAKİPÇİ</div></div>\
        <div class='statistic'><div class='value'>" + KULLANICI.following + "</div>\
        <div class='label'>TAKİP EDİLEN</div></div>\
        </div>";
    }
}

function gitHubProjeListesiniYazdir() {
    if (PROJELER) {
        document.getElementById("projeListesiBaslik").innerHTML = "<i class='tasks icon'></i> Projeler (" + PROJELER.length + ")";
        for (let i = 0; i < PROJELER.length; i++) {
            if (PROJELER[i].private) {
                document.getElementById("projeListesi").innerHTML += "<li id='" + PROJELER[i].name + "' onclick='aktifProjeyiDegistir(this.id)'>\
                <a href='#'> <i class='lock icon'></i> " + PROJELER[i].name + " (" + PROJELER[i].open_issues_count + ")</a></li>";
            } else {
                document.getElementById("projeListesi").innerHTML += "<li id='" + PROJELER[i].name + "' onclick='aktifProjeyiDegistir(this.id)'>\
                <a href='#'> <i class='unlock alternate icon'></i> " + PROJELER[i].name + " (" + PROJELER[i].open_issues_count + ")</a></li>";
            }
        }
    }
}

function aktifProjeyiDegistir(projeAdi: string) {
    if (aktifProje == projeAdi) return;
    (<HTMLInputElement>document.getElementById("yeniGirdi")).value = null;
    document.getElementById(aktifProje).className = null;
    document.getElementById(projeAdi).className = "active";
    aktifProje = projeAdi;

    if (projeAdi != "tumIsler") {
        projeninIsleriniYazdir();
        projeninKatkilariniYazdir();
    } else {
        gitHubProfilBilgileriniYazdir();
    }
}

function projeninIsleriniYazdir() {
    document.getElementById("siralanabilir").innerHTML = "<li><label><h2>Yükleniyor...</h2></label></li>";
    let ifade: string = "<li>";

    gh.getIssues(KULLANICI.login, aktifProje).listIssues({
        state: "open"
    }, function (hata: string, isler: any) {
        for (let i = 0; i < isler.length; i++) {
            ifade += "<input id='" + isler[i].id + "' type='checkbox' />";

            if (isler[i].labels.length > 0) {
                ifade += "<label for='" + isler[i].id + "' style='border-right: 8px solid #" + isler[i].labels[0].color + ";'>";
            } else {
                ifade += "<label for='" + isler[i].id + "'>";
            }

            ifade += "<h2>" + isler[i].title + "<span>" + gitHubTarihi(isler[i].created_at) + "</span></h2></label></li>";
        }
    });

    gh.getIssues(KULLANICI.login, aktifProje).listIssues({
        state: "closed"
    }, function (hata: string, isler: any) {
        for (let i = 0; i < isler.length; i++) {
            ifade += "<input id='" + isler[i].id + "' type='checkbox' checked />";

            if (isler[i].labels.length > 0) {
                ifade += "<label for='" + isler[i].id + "' style='border-right: 8px solid #" + isler[i].labels[0].color + ";'>";
            } else {
                ifade += "<label for='" + isler[i].id + "'>";
            }

            ifade += "<h2>" + isler[i].title + "<span>" + gitHubTarihi(isler[i].created_at) + "</span></h2></label></li>";
        }
        document.getElementById("siralanabilir").innerHTML = ifade;
    });
}

function projeninKatkilariniYazdir() {
    let ifade: string = "<div class='ui feed'>";
    gh.getRepo(KULLANICI.login, aktifProje).listCommits({

    }, function(hata: string, katkilar: any){
        console.log(katkilar);
        
        for (let i = 0; i < katkilar.length; i++) {
            ifade += "\
            <div class='event'>\
                <div class='label'><img src='" + katkilar[i].author.avatar_url + "'></div>\
                <div class='content'>\
                    <div class='date'>" + katkilar[i].commit.committer.name + "</div>\
                    <div class='summary'>" + katkilar[i].commit.message + "\
                        <div class='date'>" + gitHubTarihi(katkilar[i].commit.committer.date) + "</div>\
                    </div>\
                </div>\
            </div>";
        }
        ifade += "</div>";
        document.getElementById("github").innerHTML = ifade;
    });
}

function gitHubTarihi(tarih: string) {
    let ay: string = "", gun: string = "", yil: string = ""; 
    for (let i = 0; i < tarih.length; i++) {
        if (tarih[i] != "-") {
            if (i >= 0 && i < 4) {
                yil += tarih[i];
            } else if (i >= 0 && i < 7) {
                ay += tarih[i];
            } else if (i >= 0 && i < 10) {
                gun += tarih[i];
            } else {
                continue;
            }
        }
    }
    tarih = gun + "." + ay + "." + yil;
    return tarih;
}