import { Proje } from "./proje";

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

        document.getElementById(yerID).innerHTML += "<br><div class='ui tiny three statistics'>\
        <div class='statistic'><div class='value'>" + this.Projeler.length + "</div>\
        <div class='label'>PROJE</div></div>\
        <div class='statistic'><div class='value'>" + this.TakipciSayisi + "</div>\
        <div class='label'>TAKİPÇİ</div></div>\
        <div class='statistic'><div class='value'>" + this.TakipEdilenKisiSayisi + "</div>\
        <div class='label'>TAKİP EDİLEN</div></div>\
        </div>";
    }

    public projeleriListele(yerID: string) {
        document.getElementById("projeListesiBaslik").innerHTML = "<i class='tasks icon'></i> Projeler (" + this.Projeler.length + ")";

        for (let i = 0; i < this.Projeler.length; i++) {
            if (this.Projeler[i].OzelMi === true) {
                document.getElementById(yerID).innerHTML += "<li id='" + this.Projeler[i].Ad + "' onclick='aktifProjeyiDegistir(this.id)'>\
                <a href='#'> <i class='lock icon'></i> " + this.Projeler[i].Ad + " (" + this.Projeler[i].Isler.length + ")</a></li>";
            } else {
                document.getElementById(yerID).innerHTML += "<li id='" + this.Projeler[i].Ad + "' onclick='aktifProjeyiDegistir(this.id)'>\
                <a href='#'> <i class='unlock icon'></i> " + this.Projeler[i].Ad + " (" + this.Projeler[i].Isler.length + ")</a></li>";
            }
        }
    }
}
