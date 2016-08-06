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

$(document).ready(function () {
    document.getElementById("projeListesi").innerHTML = "<li class='active'><a href='#'><i class='browser icon'></i> Tüm İşler</a></li>";

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
    var self = this;
    var secenekler = {
        istemci_id: db2.exec("SELECT * FROM AJANDA")[0].values[0][0],
        istemci_sir: db2.exec("SELECT * FROM AJANDA")[0].values[0][1],
        kapsamlar: ["repo", "user", "notifications", "gist"]
    };

    var dogrulamaPenceresi = new BrowserWindow({
        width: 1200,
        height: 720,
        show: false,
        'node-integration': false,
        center: true,
        icon: __dirname + "/../img/is.png"
    });

    dogrulamaPenceresi.setMenu(null);

    var githubUrl = "https://github.com/login/oauth/authorize?";
    var dogrulamaUrl = githubUrl + "client_id=" + secenekler.istemci_id + "&scope=" + secenekler.kapsamlar;
    dogrulamaPenceresi.loadURL(dogrulamaUrl);
    dogrulamaPenceresi.show();

    function cagriylaIlgilen(url: string) {
        var ham_kod = /code=([^&]*)/.exec(url) || null;
        var kod = (ham_kod && ham_kod.length > 1) ? ham_kod[1] : null;
        var hata = /\?error=(.+)$/.exec(url);

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
        for (var i = 0; i < PROJELER.length; i++) {
            document.getElementById("projeListesi").innerHTML += "<li><a href='#'> <i class='unlock alternate icon'></i> " 
            + PROJELER[i].name + " (" + PROJELER[i].open_issues_count + ")</a></li>";
        }
    }
}