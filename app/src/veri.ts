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
const GitHub = require("github-api");
const electron = require("electron");
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

let gh: any;
let KULLANICI: Kullanici;
let fb = fs.readFileSync("app/db/id.ajanda");
let db = new SQL.Database(fb);
let aktifProje: string = null;

$(document).ready(() => {
    document.getElementById("projeListesi").innerHTML = "\
    <li class='aktif' id='tumIsler'>\
    <a href='#'><i class='loading spinner icon'></i> Yükleniyor...</a></li>";

    if (window.localStorage.getItem("githubtoken") === null) {
        gitHubGirisYap();
    } else {
        gh = new GitHub({
            token: window.localStorage.getItem("githubtoken"),
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
        console.log(durum);
        console.log(icerik.slice(icerik.search("=") + 1, icerik.search("&")));

        if (durum === "success") {
            window.localStorage.setItem("githubtoken", icerik.slice(icerik.search("=") + 1, icerik.search("&")));

            gh = new GitHub({
                token: icerik.slice(icerik.search("=") + 1, icerik.search("&")),
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
    gh.getUser().getProfile(function (hata: string, icerik: any) {
        KULLANICI = new Kullanici(icerik.login, icerik.name, icerik.bio, icerik.avatar_url, icerik.company, icerik.location,
            icerik.blog, icerik.followers, icerik.following);
    });
}

function projeBilgileriniAl() {
    gh.getUser().listRepos({
        direction: "asc",
        sort: "full_name",
        type: "all",
    }, function (hata: string, icerik: any) {
        for (let i = 0; i < icerik.length; i++) {
            KULLANICI.Projeler.push(new Proje(KULLANICI, icerik[i].full_name, icerik[i].name, icerik[i].description, icerik[i].homepage,
                icerik[i].language, icerik[i].private, icerik[i].stargazers_count,
                new GithubTarihi(icerik[i].created_at), new GithubTarihi(icerik[i].updated_at)));
        }
        isBilgileriniAl();
    });
}

function isBilgileriniAl() {
    for (let i = 0; i < KULLANICI.Projeler.length; i++) {
        acikIslerinBilgileriniAl(KULLANICI.Projeler[i]);
        kapaliIslerinBilgileriniAl(KULLANICI.Projeler[i]);

        setTimeout(() => {
            document.getElementById(KULLANICI.Projeler[i].Ad).addEventListener("click", () => {
                aktifProjeyiDegistir(KULLANICI.Projeler[i]);
            });

            gh.getRepo(KULLANICI.KullaniciAdi, KULLANICI.Projeler[i].Ad).listCommits({}, function (hata2: string, katkilar: any) {
                for (let j = 0; j < katkilar.length; j++) {
                    KULLANICI.Projeler[i].Katkilar.push(
                        new Katki(
                            katkilar[j].committer.login, katkilar[j].author.avatar_url, katkilar[j].commit.message,
                            new GithubTarihi(katkilar[j].commit.committer.date)
                        )
                    );
                }
            });
        }, 4000);

        console.log(KULLANICI.Projeler[i]);
    }
}

function acikIslerinBilgileriniAl(proje: Proje) {
    gh.getIssues(KULLANICI.KullaniciAdi, proje.Ad).listIssues({
        state: "open",
    }, function (hata: string, isler: any) {
        for (let j = 0; j < isler.length; j++) {
            proje.Isler.push(new Is(isler[j].number, proje, isler[j].title, isler[j].body,
                "Açık", new GithubTarihi(isler[j].created_at), new GithubTarihi(isler[j].updated_at),
                new GithubTarihi(isler[j].closed_at)));

            // Etiketler
            for (let k = 0; k < isler[j].labels.length; k++) {
                proje.Isler[j].Etiketler.push(
                    new Etiket(proje.Isler[j], isler[j].labels[k].name, isler[j].labels[k].color)
                );
            }

            // Hedef
            if (isler[j].milestone) {
                if (isler[j].milestone.state === "open") {
                    proje.Isler[j].Hedef = new Hedef(
                        isler[j].milestone.title,
                        isler[j].milestone.number,
                        "Açık",
                        isler[j].milestone.creator.login,
                        isler[j].milestone.description,
                        isler[j].milestone.open_issues,
                        isler[j].milestone.closed_issues,
                        new GithubTarihi(isler[j].milestone.due_on),
                        new GithubTarihi(isler[j].milestone.created_at),
                        new GithubTarihi(isler[j].milestone.updated_at),
                        new GithubTarihi(isler[j].milestone.closed_at)
                    );
                } else {
                    if (isler[j].milestone.state === "open") {
                        proje.Isler[j].Hedef = new Hedef(
                            isler[j].milestone.title,
                            isler[j].milestone.number,
                            "Kapalı",
                            isler[j].milestone.creator.login,
                            isler[j].milestone.description,
                            isler[j].milestone.open_issues,
                            isler[j].milestone.closed_issues,
                            new GithubTarihi(isler[j].milestone.due_on),
                            new GithubTarihi(isler[j].milestone.created_at),
                            new GithubTarihi(isler[j].milestone.updated_at),
                            new GithubTarihi(isler[j].milestone.closed_at)
                        );
                    }

                }

                iseAitYorumlariAl(proje.Isler[j]);
                iseAitOlaylariAl(proje.Isler[j]);
            }
        }
    });
}

function kapaliIslerinBilgileriniAl(proje: Proje) {
    gh.getIssues(KULLANICI.KullaniciAdi, proje.Ad).listIssues({
        state: "closed",
    }, function (hata: string, isler: any) {
        for (let j = 0; j < isler.length; j++) {
            proje.Isler.push(new Is(isler[j].number, proje, isler[j].title, isler[j].body,
                "Kapalı", new GithubTarihi(isler[j].created_at), new GithubTarihi(isler[j].updated_at),
                new GithubTarihi(isler[j].closed_at)));

            // Etiketler
            for (let k = 0; k < isler[j].labels.length; k++) {
                proje.Isler[j].Etiketler.push(
                    new Etiket(proje.Isler[j], isler[j].labels[k].name, isler[j].labels[k].color)
                );
            }

            // Hedef
            if (isler[j].milestone) {
                if (isler[j].milestone.state === "open") {
                    proje.Isler[j].Hedef = new Hedef(
                        isler[j].milestone.title,
                        isler[j].milestone.number,
                        "Açık",
                        isler[j].milestone.creator.login,
                        isler[j].milestone.description,
                        isler[j].milestone.open_issues,
                        isler[j].milestone.closed_issues,
                        new GithubTarihi(isler[j].milestone.due_on),
                        new GithubTarihi(isler[j].milestone.created_at),
                        new GithubTarihi(isler[j].milestone.updated_at),
                        new GithubTarihi(isler[j].milestone.closed_at)
                    );
                } else {
                    if (isler[j].milestone.state === "open") {
                        proje.Isler[j].Hedef = new Hedef(
                            isler[j].milestone.title,
                            isler[j].milestone.number,
                            "Kapalı",
                            isler[j].milestone.creator.login,
                            isler[j].milestone.description,
                            isler[j].milestone.open_issues,
                            isler[j].milestone.closed_issues,
                            new GithubTarihi(isler[j].milestone.due_on),
                            new GithubTarihi(isler[j].milestone.created_at),
                            new GithubTarihi(isler[j].milestone.updated_at),
                            new GithubTarihi(isler[j].milestone.closed_at)
                        );
                    }

                }

                iseAitYorumlariAl(proje.Isler[j]);
                iseAitOlaylariAl(proje.Isler[j]);
            }

            iseAitYorumlariAl(proje.Isler[j]);
            iseAitOlaylariAl(proje.Isler[j]);
        }
    });
}

function iseAitYorumlariAl(is: Is) {
    gh.getIssues(KULLANICI.KullaniciAdi, is.Proje.Ad).listIssueComments(
        is.No, function (hata2: string, yorumlar: any) {
            for (let l = 0; l < yorumlar.length; l++) {
                is.Yorumlar.push(
                    new Yorum(
                        yorumlar[l].user.login, yorumlar[l].user.avatar_url, yorumlar[l].body,
                        new GithubTarihi(yorumlar[l].created_at), new GithubTarihi(yorumlar[l].updated_at)
                    )
                );
            }
        }
    );
}

function iseAitOlaylariAl(is: Is) {
    gh.getIssues(KULLANICI.KullaniciAdi, is.Proje.Ad).listIssueEvents(is.No, function (hata: string, olaylar: any) {

        for (let i = 0; i < olaylar.length; i++) {
            let olay = olaylar[i];
            let eklenecekOlay: Olay = new Olay(is, olay.event, olay.actor.login, olay.actor.avatar_url, new GithubTarihi(olay.created_at));

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
    });
}

function bilgileriYazdir() {
    setTimeout(() => {
        KULLANICI.projeleriListele("projeListesi");
    }, 2000);

    setTimeout(() => {
        KULLANICI.bilgileriYazdir("github");
    }, 2500);
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
        KULLANICI.bilgileriYazdir("github");
        aktifProje = null;
    }
}

function projeBilgileriniYazdir(proje: Proje) {
    proje.ozetiYazdir();
    proje.isleriYazdir();
    proje.katkilariYazdir();
}
