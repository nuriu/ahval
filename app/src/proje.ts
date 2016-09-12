import { Is } from "./is";
import { Katki } from "./katki";
import { Kullanici } from "./kullanici";
import { GithubTarihi } from "./tarih";

/**
 * Project (repo) class.
 */
export class Proje {
    /**
     * Owner of the repo.
     */
    public Sahip: Kullanici;
    /**
     * Full name of the repo.
     */
    public TamAd: string;
    /**
     * Name of the repo.
     */
    public Ad: string;
    /**
     * Description for the repo.
     */
    public Aciklama: string;
    /**
     * Homepage of the repo.
     */
    public AnaSayfa: string;
    /**
     * Main language of the repo. 
     */
    public Dil: string;
    /**
     * is Private?
     */
    public OzelMi: boolean;
    /**
     * Star count.
     */
    public YildizSayisi: number;
    /**
     * Issue list.
     */
    public Isler: Array<Is>;
    /**
     * Comment list.
     */
    public Katkilar: Array<Katki>;
    /**
     * Creation date of the repo.
     */
    public OlusturmaTarihi: GithubTarihi;
    /**
     * Update date of the repo.
     */
    public GuncellemeTarihi: GithubTarihi;

    /**
     * Creates project (repo) object with given info.
     * @param sahip Owner.
     * @param tAd Full name of the repo.
     * @param ad Repo name.
     * @param aciklama Description for the repo.
     * @param anaSayfa Homepage.
     * @param dil Main language.
     * @param ozelMi Private status of the repo.
     * @param yildizSayisi Star count.
     * @param olusturmaTarihi Creation date.
     * @param guncellemeTarihi Update date.
     */
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

    /**
     * Updates repo related infos.
     * @param sahip Owner.
     * @param tAd Full name of the repo.
     * @param ad Repo name.
     * @param aciklama Description for the repo.
     * @param anaSayfa Homepage.
     * @param dil Main language.
     * @param ozelMi Private status of the repo.
     * @param yildizSayisi Star count.
     * @param guncellemeTarihi Update date.
     */
    public bilgileriGuncelle(sahip: Kullanici, tAd: string, ad: string, aciklama: string, anaSayfa: string, dil: string, ozelMi: boolean,
        yildizSayisi: number, guncellemeTarihi: GithubTarihi) {
        this.Sahip = sahip;
        this.TamAd = tAd;
        this.Ad = ad;
        this.Aciklama = aciklama;
        this.AnaSayfa = anaSayfa;
        this.Dil = dil;
        this.OzelMi = ozelMi;
        this.YildizSayisi = yildizSayisi;
        this.GuncellemeTarihi = guncellemeTarihi;
    }

    /**
     * Counts closed issues.
     * @return(s) Count of the closed issues.
     */
    public kapaliIsSayisi(): number {
        let kapaliIsSayisi = 0;
        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Kapalı") {
                kapaliIsSayisi++;
            }
        }
        return kapaliIsSayisi;
    }

    /**
     * Counts open issues.
     * @return(s) Count of the open issues.
     */
    public acikIsSayisi(): number {
        let acikIsSayisi = 0;
        for (let i = 0; i < this.Isler.length; i++) {
            if (this.Isler[i].Durum === "Açık") {
                acikIsSayisi++;
            }
        }
        return acikIsSayisi;
    }

    /**
     * Prints project (repo) summary.
     */
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

    /**
     * Prints all of the open issues that project (repo) have.
     */
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

    /**
     * Prints last commits made for the project (repo).
     */
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
