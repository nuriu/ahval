var fs = require("fs");
var SQL = require("sql.js");
var GitHub = require("github-api");
var request = require("superagent");
var electron = window.require("electron");
var ipcRenderer = window.require("electron").ipcRenderer;
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

var gh: any;
var KULLANICI: any;
var PROJELER: any;
var fb2 = fs.readFileSync(`${__dirname}/db/id.ajanda`);
var db2 = new SQL.Database(fb2);
var aktifProje: string;
var aktifProjeninIsleri: any[] = null;

$(document).ready(function () {
    document.getElementById("projeListesi").innerHTML = "\
    <li class='aktif' id='tumIsler' onclick='aktifProjeyiDegistir(this.id)'>\
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
            self.gitHubtanTokenIste(secenekler, kod);
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

function gitHubtanTokenIste(secenekler: any, kod: any) {
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
    document.getElementById(projeAdi).className = "aktif";
    aktifProjeninIsleri = null;
    aktifProje = projeAdi;

    if (projeAdi != "tumIsler") {
        projeninIsleriniYazdir();
        projeOzetiniYazdir();
        projeninKatkilariniYazdir();
    } else {
        gitHubProfilBilgileriniYazdir();
    }
}

function projeninIsleriniYazdir() {
    document.getElementById("siralanabilir").innerHTML = "<li><div class='is'><h3>Yükleniyor...</h3></label></li>";
    let ifade: string = "";

    gh.getIssues(KULLANICI.login, aktifProje).listIssues({
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

    gh.getIssues(KULLANICI.login, aktifProje).listIssues({
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
    gh.getRepo(KULLANICI.login, aktifProje).getDetails(function (hata: string, proje: any) {
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

    gh.getRepo(KULLANICI.login, aktifProje).listCommits({

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

function gitHubTarihi(tarih: string) {
    let zaman: string = "", gun: string = "", ay: string = "", yil: string = "";
    for (let i = 0; i < tarih.length; i++) {
        if (tarih[i] != "-") {
            if (i >= 0 && i < 4) {
                yil += tarih[i];
            } else if (i >= 0 && i < 7) {
                ay += tarih[i];
            } else if (i >= 0 && i < 10) {
                gun += tarih[i];
            } else if (i >= 11 && i < 16) {
                zaman += tarih[i]
            } else {
                continue;
            }
        }
    }
    tarih = gun + "." + ay + "." + yil + " | " + zaman;
    return tarih;
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
    gh.getIssues(KULLANICI.login, aktifProje).listIssueComments(is.number, function (hata: string, yorumlar: any) {
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
    gh.getIssues(KULLANICI.login, aktifProje).listIssueEvents(is.number, function (hata: string, olaylar: any) {
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