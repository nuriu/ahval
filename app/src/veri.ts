import { Kullanici } from "./kullanici";
import { Proje } from "./proje";

const fs = require("fs");
const SQL = require("sql.js");
const GitHub = require("github-api");
const electron = require("electron");
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

let gh: any;
let KULLANICI: Kullanici;
let fb2 = fs.readFileSync("app/db/id.ajanda");
let db2 = new SQL.Database(fb2);

$(document).ready(() => {
    document.getElementById("projeListesi").innerHTML = "\
    <li class='aktif' id='tumIsler' onclick='aktifProjeyiDegistir(this.id)'>\
    <a href='#'><i class='browser icon'></i> Tüm İşler</a></li>";

    if (!window.localStorage.getItem("githubtoken")) {
        gitHubGirisYap();
    } else {
        gh = new GitHub({
            token: window.localStorage.getItem("githubtoken"),
        });
        bilgileriAl();
    }
});

function gitHubGirisYap() {
    let secenekler = {
        istemci_id: db2.exec("SELECT * FROM AJANDA")[0].values[0][0],
        istemci_sir: db2.exec("SELECT * FROM AJANDA")[0].values[0][1],
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
        console.log(icerik);
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
    gh.getUser().getProfile(function (hata: string, icerik: any) {
        KULLANICI = new Kullanici(icerik.login, icerik.name, icerik.bio, icerik.avatar_url, icerik.company, icerik.location,
            icerik.blog, icerik.followers, icerik.following, icerik.public_repos);
    });

    gh.getUser().listRepos({
        direction: "asc",
        sort: "full_name",
        type: "all",
    }, function (hata: string, icerik: any) {
        for (let i = 0; i < icerik.length; i++) {
            KULLANICI.Projeler.push(new Proje(KULLANICI, icerik[i].full_name, icerik[i].name, icerik[i].description, icerik[i].homepage,
                icerik[i].language, icerik[i].private, icerik[i].stargazers_count,
                gitHubTarihi(icerik[i].created_at), gitHubTarihi(icerik[i].updated_at)));
        }
        bilgileriGoster();
    });
}

function bilgileriGoster() {
    KULLANICI.projeleriListele("projeListesi");
    KULLANICI.ProjeSayisi = KULLANICI.Projeler.length;
    KULLANICI.bilgileriYazdir("github");
}

function gitHubTarihi(tarih: string) {
    let zaman: string = "";
    let gun: string = "";
    let ay: string = "";
    let yil: string = "";

    for (let i = 0; i < tarih.length; i++) {
        if (tarih[i] !== "-") {
            if (i >= 0 && i < 4) {
                yil += tarih[i];
            } else if (i >= 0 && i < 7) {
                ay += tarih[i];
            } else if (i >= 0 && i < 10) {
                gun += tarih[i];
            } else if (i >= 11 && i < 16) {
                zaman += tarih[i];
            } else {
                continue;
            }
        }
    }
    tarih = gun + "." + ay + "." + yil + " | " + zaman;
    return tarih;
}

/*
function aktifProjeyiDegistir(projeAdi: string) {
    if (aktifProje == projeAdi) return;
    (<HTMLInputElement>document.getElementById("yeniGirdi")).value = null;
    document.getElementById(aktifProje).className = null;
    document.getElementById(projeAdi).className = "aktif";
    aktifProjeninIsleri = null;
    aktifProje = projeAdi;

    if (projeAdi != "tumIsler") {
        projeninIsleriniYazdir();
        projeOzetiniYazdir();
        projeninKatkilariniYazdir();
    } else {
        KULLANICI.bilgileriYazdir("github");
    }
}

function projeninIsleriniYazdir() {
    document.getElementById("siralanabilir").innerHTML = "<li><div class='is'><h3>Yükleniyor...</h3></label></li>";
    let ifade: string = "";

    gh.getIssues(KULLANICI.KullaniciAdi, aktifProje).listIssues({
        state: "open"
    }, function (hata: string, isler: any) {
        aktifProjeninIsleri = isler;
        for (let i = 0; i < isler.length; i++) {
            ifade += "<li>"
            if (isler[i].labels.length > 0) {
                ifade += "<div class='is' id='" + isler[i].id + "' style='border-right: 8px solid #" + isler[i].labels[0].color + ";' onclick='isBilgileriniYazdir(" + aktifProjeninIsleri.indexOf(isler[i]) + ")'>";
            } else {
                ifade += "<div class='is' id='" + isler[i].id + "' onclick='isBilgileriniYazdir(" + aktifProjeninIsleri.indexOf(isler[i]) + ")'>";
            }
            ifade += "<h2>" + isler[i].title + "<span>" + gitHubTarihi(isler[i].created_at) + "</span></h2></label></li>";
        }
    });

    gh.getIssues(KULLANICI.KullaniciAdi, aktifProje).listIssues({
        state: "closed"
    }, function (hata: string, isler: any) {
        for (let i = 0; i < isler.length; i++) {
            aktifProjeninIsleri.push(isler[i]);
            ifade += "<li>"
            if (isler[i].labels.length > 0) {
                ifade += "<div class='bitmis is' id='" + isler[i].id + "' style='border-right: 8px solid #" + isler[i].labels[0].color + ";' onclick='isBilgileriniYazdir(" + aktifProjeninIsleri.indexOf(isler[i]) + ")'>";
            } else {
                ifade += "<div class='bitmis is' id='" + isler[i].id + "' onclick='isBilgileriniYazdir(" + aktifProjeninIsleri.indexOf(isler[i]) + ")'>";
            }
            ifade += "<h3>" + isler[i].title + "<span>" + gitHubTarihi(isler[i].created_at) + "</span></h3></label></li>";
        }
        document.getElementById("siralanabilir").innerHTML = ifade;
    });
}

function projeOzetiniYazdir() {
    gh.getRepo(KULLANICI.KullaniciAdi, aktifProje).getDetails(function (hata: string, proje: any) {
        let ozet: string = "\
        <div class='ui fluid card'>\
            <div class='content'>\
                <div class='header'>" + proje.name + "</div>\
                <div class='meta'>\
                    <span class='right floated time'><i class='calendar outline icon'></i> " + gitHubTarihi(proje.created_at) + "</span>";
        if (proje.homepage) {
            ozet += "<span class='category'>" + proje.homepage + "</span>";
        }
        ozet += "\
                </div>\
                <div class='description'>\
                " + proje.description + "\
                </div>\
            </div>\
            <div class='extra content'>\
                <div class='right floated author'>\
                    <img class='ui avatar image' src='" + proje.owner.avatar_url + "' />\
                </div>\
            </div>\
        </div>";

        document.getElementById("github").innerHTML = ozet + "</br>";
    });
}

function projeninKatkilariniYazdir() {
    let ifade: string = "<div class='ui feed'>";

    gh.getRepo(KULLANICI.KullaniciAdi, aktifProje).listCommits({

    }, function (hata: string, katkilar: any) {
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
        document.getElementById("github").innerHTML += ifade;
    });
}

function isBilgileriniYazdir(indis: number) {
    //console.log(aktifProjeninIsleri[indis]);

    isOzetiniYazdir(aktifProjeninIsleri[indis]);

    isOlaylariniYazdir(aktifProjeninIsleri[indis]);

    isYorumlariniYazdir(aktifProjeninIsleri[indis]);
}

function isOzetiniYazdir(is: any) {
    let ozet: string = "\
    <div class='ui fluid card'>\
        <div class='content'>\
            <div class='header'>" + is.title + "</div>\
            <div class='meta'>\
                <span class='right floated time'><i class='calendar outline icon'></i> " + gitHubTarihi(is.updated_at) + "</span>";
    if (is.milestone) {
        ozet += "<span class='category'>" + is.milestone.title + "</span>";
    }
    ozet += "\
            </div>\
            <div class='description'>\
            " + is.body + "\
            </div>\
        </div>\
        <div class='extra content'>\
            <div class='right floated author'>\
                <img class='ui avatar image' src='" + is.user.avatar_url + "' />\
            </div>";

    if (is.labels.length > 0) {
        ozet += "<div class='left floated'>";
        for (let i = 0; i < is.labels.length; i++) {
            let etiket = is.labels[i];
            ozet += "<div class='ui label' style='background-color: #" + etiket.color + "; color: white;'>" + etiket.name + "</div>"
        }
        ozet += "</div>";
    }

    ozet += "</div>\
    </div>";

    document.getElementById("github").innerHTML = ozet + "</br>";
}

function isYorumlariniYazdir(is: any) {
    gh.getIssues(KULLANICI.KullaniciAdi, aktifProje).listIssueComments(is.number, function (hata: string, yorumlar: any) {
        if (!hata && yorumlar.length > 0) {

            let ifade: string = "<div class='ui comments'>";

            for (let i = 0; i < yorumlar.length; i++) {
                let yorum = yorumlar[i];

                ifade += "\
                <div class='comment'>\
                    <a class='avatar'>\
                        <img src='" + yorum.user.avatar_url + "'>\
                    </a>\
                    <div class='content'>\
                        <a class='author'>" + yorum.user.login + "</a>\
                        <div class='metadata'>\
                            <div class='date'>" + gitHubTarihi(yorum.updated_at) + "</div>\
                        </div>\
                        <div class='text'>\
                            " + yorum.body + "\
                        </div>\
                        <div class='actions'>\
                            <a class='reply active'>Cevapla</a>\
                        </div>\
                    </div>\
                </div>";
            }

            ifade += "</div>"

            document.getElementById("github").innerHTML += ifade;
        }
    });
}

function isOlaylariniYazdir(is: any) {
    gh.getIssues(KULLANICI.KullaniciAdi, aktifProje).listIssueEvents(is.number, function (hata: string, olaylar: any) {
        let ifade = "<div class='ui feed'>";

        for (let i = 0; i < olaylar.length; i++) {
            let olay = olaylar[i];

            if (olay.event == "labeled") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a>\
                                <div class='ui label' style='background-color: #" + olay.label.color + "; color: white;'>" + olay.label.name + "</div> etiketini ekledi.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "unlabeled") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a>\
                                <div class='ui label' style='background-color: #" + olay.label.color + "; color: white;'>" + olay.label.name + "</div> etiketini kaldırdı.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "assigned") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.assigner.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.assigner.login + "\
                                </a>";
                if (olay.assigner.login == olay.assignee.login) {
                    ifade += " bu işi kendisine atadı."
                } else {
                    ifade += " tarafından \
                                <a class='user'>\
                                    " + olay.assignee.login + "\
                                </a> bu işe atandı.";
                }

                ifade += "\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "unassigned") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.assigner.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.assigner.login + "\
                                </a>";
                if (olay.assigner.login == olay.assignee.login) {
                    ifade += " bu işi kendisinden aldı."
                } else {
                    ifade += " tarafından \
                                <a class='user'>\
                                    " + olay.assignee.login + "\
                                </a> bu işten alındı.";
                }

                ifade += "\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "closed") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işi kapattı.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "reopened") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işi yeniden açtı.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "subscribed") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işe abone oldu.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "mentioned") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> kişisinden bu işte bahsedildi.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "milestoned") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işi " + olay.milestone.title + " kilometre taşına ekledi.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "demilestoned") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işi " + olay.milestone.title + " kilometre taşından çıkardı.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "renamed") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işin adını <b><i>" + olay.rename.to + "</i></b> olarak değiştirdi.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "locked") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işi kilitledi.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            } else if (olay.event == "unlocked") {
                ifade += "\
                    <div class='event'>\
                        <div class='label'>\
                            <img class='ui avatar image' src='" + olay.actor.avatar_url + "'>\
                        </div>\
                        <div class='content'>\
                            <div class='summary'>\
                                <a class='user'>\
                                    " + olay.actor.login + "\
                                </a> bu işin kilidini kaldırdı.\
                                <div class='date'>" + gitHubTarihi(olay.created_at) + "</div>\
                            </div>\
                        </div>\
                    </div>";
            }
        }

        ifade += "</div>";

        document.getElementById("github").innerHTML += ifade;
    });
}
*/
