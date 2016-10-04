import { Kullanici } from "./kullanici";
import { GithubTarihi } from "./tarih";

/**
 * GitHub client class.
 */
export class GitHub {
    /**
     * GitHub User.
     */
    public Kullanici: Kullanici;
    /**
     * Client id.
     */
    private id: string;
    /**
     * Client secret id.
     */
    private secret: string;
    /**
     * Client token.
     */
    private token: string;
    /**
     * Client.
     */
    private istemci: any;

    /**
     * Creates client object.
     */
    constructor() {
        this.istemci = window["github"];
        window["gh"] = this;
    }

    /**
     * Set client id.
     */
    public idBelirle(id: string) {
        this.id = id;
    }

    /**
     * Set cliend secret id.
     */
    public secretBelirle(secret: string) {
        this.secret = secret;
    }

    /**
     * Set client token.
     */
    public tokenBelirle(token: string) {
        this.token = token;
    }

    /**
     * @return(s) Client token.
     */
    public tokeniGetir() {
        return this.token;
    }

    /**
     * Authenticates client with given token.
     * @param gitHubToken github token for oauth authentication. 
     */
    public authenticate(gitHubToken: string) {
        this.istemci.authenticate({
            token: gitHubToken,
            type: "oauth",
        });
    }

    /**
     * Get Authenticated GitHub user and create Kullanici object..
     */
    public kullaniciyiGetir() {
        this.istemci.users.get({}, (hata, veri) => {
            if (!hata) {
                this.Kullanici = new Kullanici(
                    veri.login, veri.name, veri.bio, veri.avatar_url,
                    veri.company, veri.location, veri.blog, veri.followers,
                    veri.following
                );

                $("#icerik").load("./app/ui/github.html");
            } else {
                console.log(hata);
            }
        });
    }

    /**
     * Get events.
     */
    public akisiGetir() {
        let ifade: string = "";
        this.istemci.activity.getEventsReceived({
            user: this.Kullanici.KullaniciAdi,
        }, (hata, veri) => {
            if (!hata) {
                console.log(veri);

                for (let i = 0; i < veri.length; i++) {
                    let olay = veri[i];
                    let tarih = new GithubTarihi(olay.created_at);
                    let aktor = olay.actor.login;
                    let avatar = olay.actor.avatar_url;
                    let cumle = "";
                    let ozne;

                    switch (olay.type) {
                        case "WatchEvent":
                            cumle = "bir projeyi takip etti.";
                            ozne = "<a href='#'>" + olay.repo.name + "</a>";
                            break;
                        case "IssuesEvent":
                            if (olay.payload.action === "opened") {
                                cumle = " bir iş açtı.";
                                ozne = "<a href='#'>" + olay.repo.name + "</a>" +
                                    " > <a href='#'> #" + olay.payload.issue.number + ": "
                                    + olay.payload.issue.title + "</a>";
                            } else {
                                cumle = " bir işi kapattı.";
                                ozne = "<a href='#'>" + olay.repo.name + "</a>" +
                                    " > <a href='#'> #" + olay.payload.issue.number + ": "
                                    + olay.payload.issue.title + "</a>";
                            }
                            break;
                        case "PushEvent":
                            cumle = " bir projeye katkı yaptı.";
                            ozne = "<a href='#'>" + olay.repo.name + "</a>" +
                                " > <a href='#'>" + olay.payload.commits[0].message + "</a>";
                            break;
                        case "ForkEvent":
                            cumle = " bir projeyi kopyaladı.";
                            ozne = "<a href='#'>" + olay.repo.name + "</a>";
                            break;
                        default:
                            break;
                    }

                    ifade += '\
                    <div class="event">\
                        <div class="label">\
                            <img src="' + avatar + '">\
                        </div>\
                        <div class="content">\
                            <div class="summary">\
                                <a class="user" id="aktor">' + aktor + '</a>\
                                <span>' + cumle + '</span>\
                                <div class="date" id="tarih">' + tarih.Tarih + '</div>\
                            </div>\
                            <div class="extra text">' + ozne + '\
                            </div>\
                        </div>\
                    </div><br/>';
                }
                document.getElementById("akisAlani").innerHTML = ifade;
            } else {
                console.log(hata);
            }
        });
    }
}