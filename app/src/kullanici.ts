import { Is } from "./is";
import { Katki } from "./katki";
import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";

/**
 * Main user class for storing GitHub user info and actions for it.
 */
export class Kullanici {
    /**
     * GitHub username.
     */
    public KullaniciAdi: string;
    /**
     * User name info.
     */
    public Ad: string;
    /**
     * User bio info.
     */
    public Bio: string;
    /**
     * Link of user avatar.
     */
    public Avatar: string;
    /**
     * User company info.
     */
    public Sirket: string;
    /**
     * User location info.
     */
    public Yer: string;
    /**
     * Web page of user.
     */
    public Site: string;
    /**
     * Followers count of user.
     */
    public TakipciSayisi: number;
    /**
     * Count of people which user follows.
     */
    public TakipEdilenKisiSayisi: number;
    /**
     * Projects (repos) of user.
     */
    public Projeler: Array<Proje>;

    /**
     * GitHub client.
     */
    private github = window["github"];

    /**
     * Active project.
     */
    private aktifProje: string = null;

    /**
     * Creates user object with given info.
     * @param kAdi Username (used for login) of the user.
     * @param ad Name of the user.
     * @param bio Info at bio field of the user.
     * @param avatar Avatar link of the user.
     * @param sirket Company info of the user.
     * @param yer Location info of the user.
     * @param site Web adress of the user.
     * @param takipciSayisi Follower count of the user.
     * @param takipEdilenKisiSayisi Following count of the user.
     */
    constructor(kAdi: string, ad: string, bio: string, avatar: string, sirket: string, yer: string, site: string,
                takipciSayisi: number, takipEdilenKisiSayisi: number) {
        this.KullaniciAdi = kAdi;
        this.Ad = ad;
        this.Bio = bio;
        this.Avatar = avatar;
        this.Sirket = sirket;
        this.Yer = yer;
        this.Site = site;
        this.TakipciSayisi = takipciSayisi;
        this.TakipEdilenKisiSayisi = takipEdilenKisiSayisi;
        this.Projeler = new Array<Proje>();
    }

    /**
     * Prints user info inside the element with given ID.
     * @param yerID Element ID where info will be rendered.
     */
    public bilgileriYazdir(yerID: string) {
        document.getElementById(yerID).innerHTML = "<div class='ui list'><div class='item'>\
        <img class='ui tiny avatar image' src='" + this.Avatar + "'>\
        <div class='content'>\
        <span class='header'>" + this.Ad + "</span>\
        <div class='description'><i class='github icon'></i>" + this.KullaniciAdi + "<br>"
            + this.Bio + "<br>"
            + this.Sirket + "</div>\
        </div></div></div>";
    }

    /**
     * Prints project list inside the element with given ID. 
     * @param yerID ID belongs to element where list will be rendered.
     */
    public projeleriListele(yerID: string) {
        document.getElementById("projeListesiBaslik").innerHTML = "<i class='tasks icon'></i> Projeler (" + this.Projeler.length + ")";
        document.getElementById(yerID).innerHTML = null;

        for (let i = 0; i < this.Projeler.length; i++) {
            if (this.Projeler[i].OzelMi === true) {
                document.getElementById(yerID).innerHTML += "<li id='" + this.Projeler[i].Ad + "'>\
                <a href='#'> <i class='lock icon'></i> " + this.Projeler[i].Ad + " (" + this.Projeler[i].acikIsSayisi() +
                    " / " + this.Projeler[i].Isler.length + ")</a></li>";
            } else {
                document.getElementById(yerID).innerHTML += "<li id='" + this.Projeler[i].Ad + "'>\
                <a href='#'> <i class='unlock alternate icon'></i> " + this.Projeler[i].Ad + " (" + this.Projeler[i].acikIsSayisi() +
                    " / " + this.Projeler[i].Isler.length + ")</a></li>";
            }
        }
    }

    /**
     * Updates the project (repo) info (except issue related infos).
     * @param ad Name of the project (repo).
     */
    public projeBilgileriniGuncelle(ad: string) {
        this.github.repos.get({
            repo: ad,
            user: this.KullaniciAdi,
        }, (hata, veri) => {
            if (!hata) {
                for (let i = 0; i < this.Projeler.length; i++) {
                    if (ad === this.Projeler[i].Ad) {
                        this.Projeler[i].bilgileriGuncelle(this, veri.full_name, veri.name, veri.description, veri.homepage, veri.language,
                            veri.private, veri.stargazers_count, new GithubTarihi(veri.updated_at));

                        // İş ve katkı bilgilerini temizle.
                        this.Projeler[i].Isler = new Array<Is>();
                        this.Projeler[i].Katkilar = new Array<Katki>();

                        // Yeni verileri çek.
                        this.Projeler[i].acikIslerinBilgileriniAl();
                        this.Projeler[i].kapaliIslerinBilgileriniAl();
                        this.Projeler[i].katkilariAl();

                        // Güncel bilgileri yazdır.
                        setTimeout(() => {
                            this.Projeler[i].ozetiYazdir();
                        }, 1500);
                        setTimeout(() => {
                            this.Projeler[i].isleriYazdir();
                        }, 1500);

                        break;
                    }
                }
            } else {
                console.log(hata);
            }
        });
    }

    /**
     * Gets all projects (repos) of user.
     */
    public projeBilgileriniAl() {
        this.github.repos.getAll({
            affiliation: "owner,organization_member",
        }, (hata, veri) => {
            if (!hata) {
                console.log(veri);

                if (this.Projeler.length > 0) {
                    this.Projeler = new Array<Proje>();
                }
                for (let i = 0; i < veri.length; i++) {
                    this.Projeler.push(new Proje(this, veri[i].full_name, veri[i].name, veri[i].description, veri[i].homepage,
                        veri[i].language, veri[i].private, veri[i].stargazers_count,
                        new GithubTarihi(veri[i].created_at), new GithubTarihi(veri[i].updated_at)));
                }
                this.bilgileriYazdir("profil");
                this.projeKatkilariniAl();
                this.isBilgileriniAl();

                setTimeout(() => {
                    this.projeleriListele("projeListesi");
                }, 1500);

            } else {
                console.log(hata);
            }
        });
    }

    /**
     * Gets last 30 commits made for all projects.
     */
    public projeKatkilariniAl() {
        for (let i = 0; i < this.Projeler.length; i++) {
            this.Projeler[i].katkilariAl();
        }
    }

    /**
     * Gets all issues of all projects.
     */
    public isBilgileriniAl() {
        for (let i = 0; i < this.Projeler.length; i++) {
            this.Projeler[i].acikIslerinBilgileriniAl();
            this.Projeler[i].kapaliIslerinBilgileriniAl();

            setTimeout(() => {
                document.getElementById(this.Projeler[i].Ad).addEventListener("click", () => {
                    this.aktifProjeyiDegistir(this.Projeler[i]);
                });
            }, 2000);
        }
    }

    /**
     * Changes active project to given project.
     * @params proje New project to activate.
     */
    private aktifProjeyiDegistir(proje: Proje) {
        if (proje !== null) {
            (<HTMLInputElement>document.getElementById("yeniGirdi")).value = null;

            if (this.aktifProje === proje.Ad) {
                return;
            }

            if (this.aktifProje !== null) {
                document.getElementById(this.aktifProje).className = null;
            }

            document.getElementById(proje.Ad).className = "aktif";
            this.aktifProje = proje.Ad;
            this.projeBilgileriniGuncelle(this.aktifProje);
        } else {
            document.getElementById("tumIsler").className = "aktif";
            this.bilgileriYazdir("profil");
            this.aktifProje = null;
        }
    }

}
