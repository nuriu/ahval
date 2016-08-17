import { Etiket } from "./etiket";
import { Olay } from "./olay";
import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";
import { Yorum } from "./yorum";

export class Is {
    public No: number;
    public Proje: Proje;
    public Baslik: string;
    public Icerik: string;
    public Durum: string;
    public Etiketler: Array<Etiket>;
    public Olaylar: Array<Olay>;
    public Yorumlar: Array<Yorum>;
    public OlusturmaTarihi: GithubTarihi;
    public GuncellemeTarihi: GithubTarihi;
    public KapanmaTarihi: GithubTarihi;

    constructor(no: number, proje: Proje, baslik: string, icerik: string, durum: string,
                olusturmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi, kapanmaTarihi: GithubTarihi) {
        this.Proje = proje;
        this.Baslik = baslik;
        this.No = no;
        this.Icerik = icerik;
        this.Durum = durum;
        this.OlusturmaTarihi = olusturmaTarihi;
        this.GuncellemeTarihi = guncellemeTarihi;
        this.KapanmaTarihi = kapanmaTarihi;
        this.Etiketler = new Array<Etiket>();
        this.Olaylar = new Array<Olay>();
        this.Yorumlar = new Array<Yorum>();
    }

    public bilgileriYazdir() {
        console.log("#" + this.No + " > " + this.Baslik);
        this.ozetiYazdir();
        this.yorumlariYazdir();
    }

    public ozetiYazdir() {
        let ozet: string = "\
        <div class='ui fluid card'>\
        <div class='content'>\
            <div class='header'>" + this.Baslik + "</div>\
            <div class='meta'>\
                <span class='right floated time'><i class='calendar outline icon'></i> " + this.GuncellemeTarihi.Tarih + "</span>";
        /*
        if (is.milestone) {
            ozet += "<span class='category'>" + is.milestone.title + "</span>";
        }
        */
        ozet += "\
            </div>\
            <div class='description'>\
            " + this.Icerik + "\
            </div>\
        </div>\
        <div class='extra content'>\
            <div class='right floated author'>\
                <img class='ui avatar image' src='" + this.Proje.Sahip.Avatar + "' />\
            </div>";

        if (this.Etiketler.length > 0) {
            ozet += "<div class='left floated'>";
            for (let i = 0; i < this.Etiketler.length; i++) {
                ozet += "\
                <div class='ui label' style='background-color: " + this.Etiketler[i].Renk + "; color: white;'>"
                    + this.Etiketler[i].Ad + "</div>";
            }
            ozet += "</div>";
        }

        ozet += "</div></div>";
        document.getElementById("github").innerHTML = ozet + "</br>";
    }

    public yorumlariYazdir() {
        let ifade: string = "<div class='ui comments'>";
        for (let i = 0; i < this.Yorumlar.length; i++) {

            ifade += "\
                <div class='comment'>\
                    <a class='avatar'>\
                        <img src='" + this.Yorumlar[i].Avatar + "'>\
                    </a>\
                    <div class='content'>\
                        <a class='author'>" + this.Yorumlar[i].Yapan + "</a>\
                        <div class='metadata'>\
                            <div class='date'>" + this.Yorumlar[i].GuncellenmeTarihi.Tarih + "</div>\
                        </div>\
                        <div class='text'>\
                            " + this.Yorumlar[i].Metin + "\
                        </div>\
                        <div class='actions'>\
                            <a class='reply active'>Cevapla</a>\
                        </div>\
                    </div>\
                </div>";
        }

        ifade += "</div>";

        document.getElementById("github").innerHTML += ifade;
    }

    public olaylariYazdir() {

    }
}
