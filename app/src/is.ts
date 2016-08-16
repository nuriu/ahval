import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";

export class Is {
    public Proje: Proje;
    public Baslik: string;
    public No: number;
    public Icerik: string;
    public Durum: string;
    public OlusturmaTarihi: GithubTarihi;
    public GuncellemeTarihi: GithubTarihi;
    public KapanmaTarihi: GithubTarihi;
    constructor(proje: Proje, baslik: string, no: number, icerik: string, durum: string,
                olusturmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi, kapanmaTarihi: GithubTarihi) {
        this.Proje = proje;
        this.Baslik = baslik;
        this.No = no;
        this.Icerik = icerik;
        this.Durum = durum;
        this.OlusturmaTarihi = olusturmaTarihi;
        this.GuncellemeTarihi = guncellemeTarihi;
        this.KapanmaTarihi = kapanmaTarihi;
    }
}

// TODO: Olay sınıfını oluştur, Olaylar üyesini ekle.
