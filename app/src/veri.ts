import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
import { Is } from "./is";
import { Katki } from "./katki";
import { Kullanici } from "./kullanici";
import { Olay } from "./olay";
import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";
import { Yorum } from "./yorum";

const fs = require("fs");
const SQL = require("sql.js");
const Client = require("github");
const electron = require("electron");
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

let github: any;
let KULLANICI: Kullanici;
let fb = fs.readFileSync("app/db/id.ajanda");
let db = new SQL.Database(fb);
let aktifProje: string = null;

$(document).ready(() => {
    document.getElementById("projeListesi").innerHTML = "\
    <li class='aktif' id='tumIsler'>\
    <a href='#'><i class='loading spinner icon'></i> Yükleniyor...</a></li>";

    github = window["github"];

    if (window.localStorage.getItem("githubtoken") === null) {
        gitHubGirisYap();
    } else {
        github.authenticate({
            token: window.localStorage.getItem("githubtoken"),
            type: "oauth",
        });

        bilgileriAl();

        setTimeout(() => {
            bilgileriYazdir();
        }, 1000);
    }
});

function gitHubGirisYap() {
    let secenekler = {
        istemci_id: db.exec("SELECT * FROM AJANDA")[0].values[0][0],
        istemci_sir: db.exec("SELECT * FROM AJANDA")[0].values[0][1],
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

    dogrulamaPenceresi.webContents.on("will-navigate", function (olay: any, url: string) {
        cagriylaIlgilen(url);
    });

    dogrulamaPenceresi.webContents.on("did-get-redirect-request", function (olay: any, eskiUrl: string, yeniUrl: string) {
        cagriylaIlgilen(yeniUrl);
    });

    dogrulamaPenceresi.on("close", function () {
        dogrulamaPenceresi = null;
    });
}

function gitHubtanTokenIste(secenekler: any, kod: any) {
    $.post("https://github.com/login/oauth/access_token", {
        client_id: secenekler.istemci_id,
        client_secret: secenekler.istemci_sir,
        code: kod,
    }).done(function (icerik: string, durum: string) {
        /* token
        console.log(durum);
        console.log(icerik.slice(icerik.search("=") + 1, icerik.search("&")));
        */

        if (durum === "success") {
            window.localStorage.setItem("githubtoken", icerik.slice(icerik.search("=") + 1, icerik.search("&")));

            github.authenticate({
                token: icerik.slice(icerik.search("=") + 1, icerik.search("&")),
                type: "oauth",
            });

            bilgileriAl();
        }
    });
}

function bilgileriAl() {
    kulaniciBilgileriniAl();
    projeBilgileriniAl();
}

function kulaniciBilgileriniAl() {
    github.users.get({}, function (hata, veri) {
        if (!hata) {
            KULLANICI = new Kullanici(veri.login, veri.name, veri.bio, veri.avatar_url, veri.company, veri.location,
                veri.blog, veri.followers, veri.following);
        } else {
            console.log(hata);
        }
    });
}

function projeBilgileriniAl() {
    github.repos.getAll({
        "affiliation": "owner,organization_member"
    }, function (hata, veri) {
        if (!hata) {
            for (let i = 0; i < veri.length; i++) {
                KULLANICI.Projeler.push(new Proje(KULLANICI, veri[i].full_name, veri[i].name, veri[i].description, veri[i].homepage,
                    veri[i].language, veri[i].private, veri[i].stargazers_count,
                    new GithubTarihi(veri[i].created_at), new GithubTarihi(veri[i].updated_at)));
            }
            isBilgileriniAl();
        } else {
            console.log(hata);
        }
    });
}

function isBilgileriniAl() {
    for (let i = 0; i < KULLANICI.Projeler.length; i++) {
        acikIslerinBilgileriniAl(KULLANICI.Projeler[i]);
        kapaliIslerinBilgileriniAl(KULLANICI.Projeler[i]);

        // Proje katkıları
        github.repos.getCommits({
            user: KULLANICI.KullaniciAdi,
            repo: KULLANICI.Projeler[i].Ad,
        }, function (hata, veri) {
            if (!hata) {
                for (let j = 0; j < veri.length; j++) {
                    KULLANICI.Projeler[i].Katkilar.push(
                        new Katki(
                            veri[j].committer.login, veri[j].author.avatar_url, veri[j].commit.message,
                            new GithubTarihi(veri[j].commit.committer.date)
                        )
                    );
                }
            } else {
                console.log(hata);
            }
        });

        setTimeout(() => {
            document.getElementById(KULLANICI.Projeler[i].Ad).addEventListener("click", () => {
                aktifProjeyiDegistir(KULLANICI.Projeler[i]);
            });
        }, 2500);

        console.log(KULLANICI.Projeler[i]);
    }
}

function acikIslerinBilgileriniAl(proje: Proje) {
    github.issues.getForRepo({
        user: KULLANICI.KullaniciAdi,
        repo: proje.Ad,
        state: "open",
    }, function (hata, veri) {
        if (!hata) {
            for (let j = 0; j < veri.length; j++) {
                proje.Isler.push(new Is(veri[j].number, proje, veri[j].title, veri[j].body,
                    "Açık", new GithubTarihi(veri[j].created_at), new GithubTarihi(veri[j].updated_at),
                    new GithubTarihi(veri[j].closed_at)));

                // Etiketler
                for (let k = 0; k < veri[j].labels.length; k++) {
                    proje.Isler[proje.Isler.length - 1].Etiketler.push(
                        new Etiket(proje.Isler[proje.Isler.length - 1], veri[j].labels[k].name, veri[j].labels[k].color)
                    );
                }

                // Hedef
                if (veri[j].milestone) {
                    if (veri[j].milestone.state === "open") {
                        proje.Isler[proje.Isler.length - 1].Hedef = new Hedef(
                            veri[j].milestone.title,
                            veri[j].milestone.number,
                            "Açık",
                            veri[j].milestone.creator.login,
                            veri[j].milestone.description,
                            veri[j].milestone.open_issues,
                            veri[j].milestone.closed_issues,
                            new GithubTarihi(veri[j].milestone.due_on),
                            new GithubTarihi(veri[j].milestone.created_at),
                            new GithubTarihi(veri[j].milestone.updated_at),
                            new GithubTarihi(veri[j].milestone.closed_at)
                        );
                    } else {
                        proje.Isler[proje.Isler.length - 1].Hedef = new Hedef(
                            veri[j].milestone.title,
                            veri[j].milestone.number,
                            "Kapalı",
                            veri[j].milestone.creator.login,
                            veri[j].milestone.description,
                            veri[j].milestone.open_issues,
                            veri[j].milestone.closed_issues,
                            new GithubTarihi(veri[j].milestone.due_on),
                            new GithubTarihi(veri[j].milestone.created_at),
                            new GithubTarihi(veri[j].milestone.updated_at),
                            new GithubTarihi(veri[j].milestone.closed_at)
                        );
                    }
                }

                if (proje.Isler[j].Yorumlar.length < 1) {
                    iseAitYorumlariAl(proje.Isler[proje.Isler.length - 1]);
                }

                if (proje.Isler[j].Olaylar.length < 1) {
                    iseAitOlaylariAl(proje.Isler[proje.Isler.length - 1]);
                }
            }
        } else {
            console.log(hata);
        }
    });
}

function kapaliIslerinBilgileriniAl(proje: Proje) {
    github.issues.getForRepo({
        user: KULLANICI.KullaniciAdi,
        repo: proje.Ad,
        state: "closed",
    }, function (hata, veri) {
        if (!hata) {
            for (let j = 0; j < veri.length; j++) {
                proje.Isler.push(new Is(veri[j].number, proje, veri[j].title, veri[j].body,
                    "Kapalı", new GithubTarihi(veri[j].created_at), new GithubTarihi(veri[j].updated_at),
                    new GithubTarihi(veri[j].closed_at)));

                // Etiketler
                for (let k = 0; k < veri[j].labels.length; k++) {
                    proje.Isler[proje.Isler.length - 1].Etiketler.push(
                        new Etiket(proje.Isler[proje.Isler.length - 1], veri[j].labels[k].name, veri[j].labels[k].color)
                    );
                }

                // Hedef
                if (veri[j].milestone) {
                    if (veri[j].milestone.state === "open") {
                        proje.Isler[proje.Isler.length - 1].Hedef = new Hedef(
                            veri[j].milestone.title,
                            veri[j].milestone.number,
                            "Açık",
                            veri[j].milestone.creator.login,
                            veri[j].milestone.description,
                            veri[j].milestone.open_issues,
                            veri[j].milestone.closed_issues,
                            new GithubTarihi(veri[j].milestone.due_on),
                            new GithubTarihi(veri[j].milestone.created_at),
                            new GithubTarihi(veri[j].milestone.updated_at),
                            new GithubTarihi(veri[j].milestone.closed_at)
                        );
                    } else {
                        proje.Isler[proje.Isler.length - 1].Hedef = new Hedef(
                            veri[j].milestone.title,
                            veri[j].milestone.number,
                            "Kapalı",
                            veri[j].milestone.creator.login,
                            veri[j].milestone.description,
                            veri[j].milestone.open_issues,
                            veri[j].milestone.closed_issues,
                            new GithubTarihi(veri[j].milestone.due_on),
                            new GithubTarihi(veri[j].milestone.created_at),
                            new GithubTarihi(veri[j].milestone.updated_at),
                            new GithubTarihi(veri[j].milestone.closed_at)
                        );
                    }
                }

                if (proje.Isler[j].Yorumlar.length < 1) {
                    iseAitYorumlariAl(proje.Isler[proje.Isler.length - 1]);
                }

                if (proje.Isler[j].Olaylar.length < 1) {
                    iseAitOlaylariAl(proje.Isler[proje.Isler.length - 1]);
                }
            }
        } else {
            console.log(hata);
        }
    });
}

function iseAitYorumlariAl(is: Is) {
    github.issues.getComments({
        number: is.No,
        repo: is.Proje.Ad,
        user: KULLANICI.KullaniciAdi,
    }, function (hata, veri) {
        if (!hata) {
            for (let i = 0; i < veri.length; i++) {
                is.Yorumlar.push(
                    new Yorum(
                        veri[i].user.login, veri[i].user.avatar_url, veri[i].body,
                        new GithubTarihi(veri[i].created_at), new GithubTarihi(veri[i].updated_at)
                    )
                );
            }
        } else {
            console.log(hata);
        }
    });
}

function iseAitOlaylariAl(is: Is) {
    github.issues.getEvents({
        user: KULLANICI.KullaniciAdi,
        repo: is.Proje.Ad,
        number: is.No,
    }, function (hata, veri) {
        if (!hata) {
            for (let i = 0; i < veri.length; i++) {
                let olay = veri[i];

                let eklenecekOlay: Olay = new Olay(
                    is, olay.event, olay.actor.login, olay.actor.avatar_url,
                    new GithubTarihi(olay.created_at)
                );

                if (olay.label) { eklenecekOlay.Etiket = new Etiket(is, olay.label.name, olay.label.color); }

                if (olay.assignee && olay.assigner) {
                    eklenecekOlay.Atayan = olay.assigner.login;
                    eklenecekOlay.AtayanAvatar = olay.assigner.avatar_url;
                    eklenecekOlay.Atanan = olay.assignee.login;
                    eklenecekOlay.AtananAvatar = olay.assignee.avatar_url;
                }

                if (olay.milestone) { eklenecekOlay.Hedef = new Hedef(olay.milestone.title); }

                if (olay.rename) {
                    eklenecekOlay.OncekiAd = olay.rename.from;
                    eklenecekOlay.SonrakiAd = olay.rename.to;
                }

                is.Olaylar.push(eklenecekOlay);
            }
        } else {
            console.log(hata);
        }
    });
}

function bilgileriYazdir() {
    setTimeout(() => {
        KULLANICI.projeleriListele("projeListesi");
    }, 1500);
    KULLANICI.bilgileriYazdir("profil");
}

function aktifProjeyiDegistir(proje: Proje) {
    if (proje !== null) {
        (<HTMLInputElement>document.getElementById("yeniGirdi")).value = null;

        if (aktifProje === proje.Ad) {
            return;
        }

        if (aktifProje !== null) {
            document.getElementById(aktifProje).className = null;
        }

        document.getElementById(proje.Ad).className = "aktif";
        aktifProje = proje.Ad;

        projeBilgileriniYazdir(proje);
    } else {
        document.getElementById("tumIsler").className = "aktif";
        KULLANICI.bilgileriYazdir("profil");
        aktifProje = null;
    }
}

function projeBilgileriniYazdir(proje: Proje) {
    proje.ozetiYazdir();
    proje.isleriYazdir();
}
