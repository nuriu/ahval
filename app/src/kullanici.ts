import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";

export class Kullanici {
    public KullaniciAdi: string;
    public Ad: string;
    public Bio: string;
    public Avatar: string;
    public Sirket: string;
    public Yer: string;
    public Site: string;
    public TakipciSayisi: number;
    public TakipEdilenKisiSayisi: number;
    public Projeler: Array<Proje>;

    private github = window["github"];

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
        this.Projeler = Array<Proje>();
    }

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

    public projeBilgileriniGuncelle(ad: string) {
        this.github.repos.get({
            repo: ad,
            user: this.KullaniciAdi,
        }, (hata, veri) => {
            if (!hata) {
                for (let i = 0; i < this.Projeler.length; i++) {
                    if (ad === this.Projeler[i].Ad) {
                        this.Projeler[i].bilgileriGuncelle(this, veri.full_name, veri.name, veri.description, veri.homepage, veri.language,
                            veri.private, veri.stargazers_count, new GithubTarihi(veri.created_at), new GithubTarihi(veri.updated_at));
                        break;
                    }
                }
            } else {
                console.log(hata);
            }
        });
    }
}
