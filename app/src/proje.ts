import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
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
     * GitHub client.
     */
    private github = window["github"];

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
     * Get all open issues for this project (repo).
     */
    public acikIslerinBilgileriniAl() {
        this.github.issues.getForRepo({
            repo: this.Ad,
            state: "open",
            user: this.Sahip.KullaniciAdi,
        }, (hata, veri) => {
            if (!hata) {
                for (let j = 0; j < veri.length; j++) {
                    this.Isler.push(new Is(veri[j].number, this, veri[j].title, veri[j].body,
                        "Açık", new GithubTarihi(veri[j].created_at), new GithubTarihi(veri[j].updated_at),
                        new GithubTarihi(veri[j].closed_at)));

                    // Etiketler
                    for (let k = 0; k < veri[j].labels.length; k++) {
                        this.Isler[this.Isler.length - 1].Etiketler.push(
                            new Etiket(this.Isler[this.Isler.length - 1], veri[j].labels[k].name, veri[j].labels[k].color)
                        );
                    }

                    // Hedef
                    if (veri[j].milestone) {
                        if (veri[j].milestone.state === "open") {
                            this.Isler[this.Isler.length - 1].Hedef = new Hedef(
                                veri[j].milestone.title,
                                veri[j].milestone.number,
                                "Açık",
                                veri[j].milestone.creator.login,
                                veri[j].milestone.description,
                                veri[j].milestone.open_issues,
                                veri[j].milestone.closed_issues,
                                new GithubTarihi(veri[j].milestone.due_on),
                                new GithubTarihi(veri[j].milestone.created_at),
                                new GithubTarihi(veri[j].milestone.updated_at),
                                new GithubTarihi(veri[j].milestone.closed_at)
                            );
                        } else {
                            this.Isler[this.Isler.length - 1].Hedef = new Hedef(
                                veri[j].milestone.title,
                                veri[j].milestone.number,
                                "Kapalı",
                                veri[j].milestone.creator.login,
                                veri[j].milestone.description,
                                veri[j].milestone.open_issues,
                                veri[j].milestone.closed_issues,
                                new GithubTarihi(veri[j].milestone.due_on),
                                new GithubTarihi(veri[j].milestone.created_at),
                                new GithubTarihi(veri[j].milestone.updated_at),
                                new GithubTarihi(veri[j].milestone.closed_at)
                            );
                        }
                    }

                    if (this.Isler[j].Yorumlar.length < 1) {
                        this.Isler[this.Isler.length - 1].iseAitYorumlariAl();
                    }

                    if (this.Isler[j].Olaylar.length < 1) {
                        this.Isler[this.Isler.length - 1].iseAitOlaylariAl();
                    }
                }
            } else {
                console.log(hata);
            }
        });
    }

    /**
     * Get all closed issues for this project (repo).
     */
    public kapaliIslerinBilgileriniAl() {
        this.github.issues.getForRepo({
            repo: this.Ad,
            state: "closed",
            user: this.Sahip.KullaniciAdi,
        }, (hata, veri) => {
            if (!hata) {
                for (let j = 0; j < veri.length; j++) {
                    this.Isler.push(new Is(veri[j].number, this, veri[j].title, veri[j].body,
                        "Kapalı", new GithubTarihi(veri[j].created_at), new GithubTarihi(veri[j].updated_at),
                        new GithubTarihi(veri[j].closed_at)));

                    // Etiketler
                    for (let k = 0; k < veri[j].labels.length; k++) {
                        this.Isler[this.Isler.length - 1].Etiketler.push(
                            new Etiket(this.Isler[this.Isler.length - 1], veri[j].labels[k].name, veri[j].labels[k].color)
                        );
                    }

                    // Hedef
                    if (veri[j].milestone) {
                        if (veri[j].milestone.state === "open") {
                            this.Isler[this.Isler.length - 1].Hedef = new Hedef(
                                veri[j].milestone.title,
                                veri[j].milestone.number,
                                "Açık",
                                veri[j].milestone.creator.login,
                                veri[j].milestone.description,
                                veri[j].milestone.open_issues,
                                veri[j].milestone.closed_issues,
                                new GithubTarihi(veri[j].milestone.due_on),
                                new GithubTarihi(veri[j].milestone.created_at),
                                new GithubTarihi(veri[j].milestone.updated_at),
                                new GithubTarihi(veri[j].milestone.closed_at)
                            );
                        } else {
                            this.Isler[this.Isler.length - 1].Hedef = new Hedef(
                                veri[j].milestone.title,
                                veri[j].milestone.number,
                                "Kapalı",
                                veri[j].milestone.creator.login,
                                veri[j].milestone.description,
                                veri[j].milestone.open_issues,
                                veri[j].milestone.closed_issues,
                                new GithubTarihi(veri[j].milestone.due_on),
                                new GithubTarihi(veri[j].milestone.created_at),
                                new GithubTarihi(veri[j].milestone.updated_at),
                                new GithubTarihi(veri[j].milestone.closed_at)
                            );
                        }
                    }

                    if (this.Isler[j].Yorumlar.length < 1) {
                        this.Isler[this.Isler.length - 1].iseAitYorumlariAl();
                    }

                    if (this.Isler[j].Olaylar.length < 1) {
                        this.Isler[this.Isler.length - 1].iseAitOlaylariAl();
                    }
                }
            } else {
                console.log(hata);
            }
        });
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
