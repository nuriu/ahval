import { Is } from "./is";
import { Katki } from "./katki";
import { Kullanici } from "./kullanici";
import { GithubTarihi } from "./tarih";

export class Proje {
    public Sahip: Kullanici;
    public TamAd: string;
    public Ad: string;
    public Aciklama: string;
    public AnaSayfa: string;
    public Dil: string;
    public OzelMi: boolean;
    public YildizSayisi: number;
    public Isler: Array<Is>;
    public Katkilar: Array<Katki>;
    public OlusturmaTarihi: GithubTarihi;
    public GuncellemeTarihi: GithubTarihi;

    constructor(sahip: Kullanici, tAd: string, ad: string, aciklama: string, anaSayfa: string, dil: string, ozelMi: boolean,
                yildizSayisi: number, olusturmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi) {
        this.Sahip = sahip;
        this.TamAd = tAd;
        this.Ad = ad;
        this.Aciklama = aciklama;
        this.AnaSayfa = anaSayfa;
        this.Dil = dil;
        this.OzelMi = ozelMi;
        this.YildizSayisi = yildizSayisi;
        this.OlusturmaTarihi = olusturmaTarihi;
        this.GuncellemeTarihi = guncellemeTarihi;

        if (!this.Isler) {
            this.Isler = new Array<Is>();
        }

        if (!this.Katkilar) {
            this.Katkilar = new Array<Katki>();
        }
    }

    public bilgileriGuncelle(sahip: Kullanici, tAd: string, ad: string, aciklama: string, anaSayfa: string, dil: string, ozelMi: boolean,
                             yildizSayisi: number, olusturmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi) {
        this.Sahip = sahip;
        this.TamAd = tAd;
        this.Ad = ad;
        this.Aciklama = aciklama;
        this.AnaSayfa = anaSayfa;
        this.Dil = dil;
        this.OzelMi = ozelMi;
        this.YildizSayisi = yildizSayisi;
        this.OlusturmaTarihi = olusturmaTarihi;
        this.GuncellemeTarihi = guncellemeTarihi;
    }

    public kapaliIsSayisi(): number {
        let kapaliIsSayisi = 0;
        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Kapalı") {
                kapaliIsSayisi++;
            }
        }
        return kapaliIsSayisi;
    }

    public acikIsSayisi(): number {
        let acikIsSayisi = 0;
        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Açık") {
                acikIsSayisi++;
            }
        }
        return acikIsSayisi;
    }

    public ozetiYazdir() {
        let ozet: string = "\
        <div class='ui fluid card'>\
            <div class='content'>\
                <img class='right floated mini ui image' src='" + this.Sahip.Avatar + "' />\
                <div class='header'> " + this.Ad + " </div>\
                <div class='meta'>\
                    <span class='left floated time'><i class='calendar outline icon'></i> " + this.OlusturmaTarihi.Tarih + " | </span>";
        if (this.AnaSayfa) {
            ozet += "<span class='category'>" + this.AnaSayfa + "</span>";
        }
        ozet += "\
                </div>\
                <div class='description'>\
                " + this.Aciklama + "\
                </div>\
            </div>\
            <div class='extra content'>" +
            this.katkilariYazdir() +
            "</div>\
        </div>";

        document.getElementById("projeBilgileri").innerHTML = ozet;
    }

    public isleriYazdir() {
        document.getElementById("projeIsleri").innerHTML = "";

        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Açık") {
                this.Isler[i].ozetiYazdir("projeIsleri");
            }
        }

        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Kapalı") {
                this.Isler[i].ozetiYazdir("projeIsleri");
            }
        }
    }

    private katkilariYazdir(): string {
        let ifade: string = "<div class='ui feed'>";
        for (let i = 0; i < this.Katkilar.length; i++) {
            ifade += "\
            <div class='event'>\
                <div class='label'><img src='" + this.Katkilar[i].Avatar + "'></div>\
                <div class='content'>\
                    <div class='date'>" + this.Katkilar[i].Yapan + "</div>\
                    <div class='summary'>" + this.Katkilar[i].Mesaj + "\
                        <div class='date'>" + this.Katkilar[i].YapilanTarih.Tarih + "</div>\
                    </div>\
                </div>\
            </div>";
        }
        ifade += "</div>";
        return ifade;
    }
}
