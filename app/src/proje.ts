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
        this.Isler = new Array<Is>();
        this.Katkilar = new Array<Katki>();
    }

    public ozetiYazdir() {
        let ozet: string = "\
        <div class='ui fluid card'>\
            <div class='content'>\
                <div class='header'>" + this.Ad + "</div>\
                <div class='meta'>\
                    <span class='right floated time'><i class='calendar outline icon'></i> " + this.OlusturmaTarihi.Tarih + "</span>";
        if (this.AnaSayfa) {
            ozet += "<span class='category'>" + this.AnaSayfa + "</span>";
        }
        ozet += "\
                </div>\
                <div class='description'>\
                " + this.Aciklama + "\
                </div>\
            </div>\
            <div class='extra content'>\
                <div class='right floated author'>\
                    <img class='ui avatar image' src='" + this.Sahip.Avatar + "' />\
                </div>\
            </div>\
        </div>";

        document.getElementById("github").innerHTML = ozet + "</br>";
    }

    public isleriYazdir() {
        document.getElementById("siralanabilir").innerHTML = "\
        <li><div class='is'><i class='loading spinner icon'></i> <h3>Yükleniyor...</h3></div></li>";
        let ifade: string = "";

        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Açık") {
                ifade += "<li>";
                if (this.Isler[i].Etiketler.length > 0) {
                    ifade += "\
                    <div class='is' id='" + this.Isler[i].No + "' \
                    style='border-right: 8px solid " + this.Isler[i].Etiketler[0].Renk + ";'>";
                } else {
                    ifade += "<div class='is' id='" + this.Isler[i].No + "'>";
                }
                ifade += "<h2>" + this.Isler[i].Baslik + "<span>" + this.Isler[i].OlusturmaTarihi.Tarih + "</span></h2></label></li>";
            } else {
                ifade += "<li>";
                if (this.Isler[i].Etiketler.length > 0) {
                    ifade += "\
                    <div class='bitmis is' id='" + this.Isler[i].No + "' \
                    style='border-right: 8px solid " + this.Isler[i].Etiketler[0].Renk + ";'>";
                } else {
                    ifade += "<div class='bitmis is' id='" + this.Isler[i].No + "'>";
                }
                ifade += "<h3>" + this.Isler[i].Baslik + "<span>" + this.Isler[i].OlusturmaTarihi.Tarih + "</span></h3></label></li>";
            }

            setTimeout(() => {
                document.getElementById("" + this.Isler[i].No).addEventListener("click", () => {
                    this.Isler[i].bilgileriYazdir();
                });
            }, 500);
        }
        document.getElementById("siralanabilir").innerHTML = ifade;
    }

    public katkilariYazdir() {
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
        document.getElementById("github").innerHTML += ifade;
    }
}
