import { Is } from "./is";
import { Kullanici } from "./kullanici";
import { GithubTarihi } from "./tarih";

export class Proje {
    public Sahip: Kullanici;
    public TamAd: string;
    public Ad: string;
    public Aciklama: string;
    public Isler: Array<Is>;
    public AnaSayfa: string;
    public Dil: string;
    public OzelMi: boolean;
    public YildizSayisi: number;
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
    }

    public isleriYazdir() {
        for (let i = 0; i < this.Isler.length; i++) {

        }
    }

}
