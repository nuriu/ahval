import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
import { Olay } from "./olay";
import { Turler } from "./olay";
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
    public Hedef: Hedef;
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
        console.log("#" + this.No + " > " + this.Baslik + " : " + this.Durum);
        // this.yorumlariYazdir();
        // this.olaylariYazdir();
    }

    public ozetiYazdir(yerID: string) {
        if (this.Durum === "Açık") {
            let ozet: string = "\
            <div class='ui fluid card' id='" + this.No + "'>\
            <div class='content'>\
                <div class='header'>" + this.Baslik + "</div>\
                <div class='meta'>\
                    <span class='right floated time'><i class='calendar outline icon'></i> " + this.GuncellemeTarihi.Tarih + "</span>";

            if (this.Hedef) {
                ozet += "<span class='category'>" + this.Hedef.Baslik + "</span>";
            }

            ozet += "</div>\
                <div class='description'>\
                " + this.Icerik + "\
                </div>\
            </div>\
            <div class='extra content' >\
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

            document.getElementById(yerID).innerHTML += ozet;

            setTimeout(() => {
                document.getElementById("" + this.No).addEventListener("click", () => {
                    this.bilgileriYazdir();
                });
            }, 500);
        }
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
        let ifade = "<div class='ui feed'>";

        for (let i = 0; i < this.Olaylar.length; i++) {
            let olay = this.Olaylar[i];

            switch (olay.Tur) {
                case Turler.EtiketEkleme:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>" + olay.Aktor + "</a>\
                                        <div class='ui label' style='background-color: " + olay.Etiket.Renk + "; color: white;'>"
                        + olay.Etiket.Ad + "</div> etiketini ekledi.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.EtiketKaldirma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>" + olay.Aktor + "</a>\
                                        <div class='ui label' style='background-color: #" + olay.Etiket.Renk + "; color: white;'>"
                        + olay.Etiket.Ad + "</div> etiketini kaldırdı.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.KisiyeAtama:
                    ifade += " <div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.AtayanAvatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>" + olay.Atayan + "</a>";

                    if (olay.Atayan === olay.Atanan) {
                        ifade += " bu işi kendisine atadı.";
                    } else {
                        ifade += " tarafından <a class='user'>" + olay.Atanan + "</a> bu işe atandı.";
                    }

                    ifade += "<div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.KisidenAlma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.AtayanAvatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>" + olay.Atayan + "</a>";

                    if (olay.Atayan === olay.Atanan) {
                        ifade += " bu işi kendisinden aldı.";
                    } else {
                        ifade += " tarafından <a class='user'>" + olay.Atanan + "</a> bu işten alındı.";
                    }

                    ifade += "<div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.Kapatma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>" + olay.Aktor + "</a> bu işi kapattı.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.TekrarAcma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işi yeniden açtı.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.AboneOlma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işe abone oldu.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.Bahsetme:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> kişisinden bu işte bahsedildi.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.HedefEkleme:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işi " + olay.Hedef.Baslik + " hedefine ekledi.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.HedefKaldirma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işi " + olay.Hedef.Baslik + " hedefinden çıkardı.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.YenidenAdlandirma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işin adını <b><i>" + olay.SonrakiAd + "</i></b> olarak değiştirdi.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.Kilitleme:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işi kilitledi.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                case Turler.KilidiAcma:
                    ifade += "<div class='event'>\
                                <div class='label'>\
                                    <img class='ui avatar image' src='" + olay.Avatar + "'>\
                                </div>\
                                <div class='content'>\
                                    <div class='summary'>\
                                        <a class='user'>\
                                            " + olay.Aktor + "\
                                        </a> bu işin kilidini kaldırdı.\
                                        <div class='date'>" + olay.GerceklesmeTarihi.Tarih + "</div></div></div></div>";
                    break;

                default:
                    break;
            }
        }

        ifade += "</div>";
        document.getElementById("github").innerHTML += ifade;
    }
}
