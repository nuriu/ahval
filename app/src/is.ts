import { Etiket } from "./etiket";
import { Olay } from "./olay";
import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";

export class Is {
    public No: number;
    public Proje: Proje;
    public Baslik: string;
    public Icerik: string;
    public Durum: string;
    public Etiketler: Array<Etiket>;
    public Olaylar: Array<Olay>;
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
    }
}