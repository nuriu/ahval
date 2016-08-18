import { GithubTarihi } from "./tarih";

export class Hedef {
    public No: number;
    public Durum: string;
    public Baslik: string;
    public Olusturan: string; // TODO: KULLANICI OLACAK
    public Aciklama: string;
    public AcikIsSayisi: number;
    public KapaliIsSayisi: number;
    public HedefTarih: GithubTarihi;
    public OlusturmaTarihi: GithubTarihi;
    public GuncellemeTarihi: GithubTarihi;
    public KapanmaTarihi: GithubTarihi;

    constructor(baslik: string, no?: number, durum?: string, olusturan?: string, aciklama?: string,
                acikIsSayisi?: number, kapaliIsSayisi?: number, hedefTarih?: GithubTarihi,
                olusturmaTarihi?: GithubTarihi, guncellemeTarihi?: GithubTarihi, kapanmaTarihi?: GithubTarihi) {

        this.Baslik = baslik;
        if (no) { this.No = no; }
        if (durum) { this.No = no; }
        if (olusturan) { this.Olusturan = olusturan; }
        if (aciklama) { this.Aciklama = aciklama; }
        if (acikIsSayisi) { this.AcikIsSayisi = acikIsSayisi; }
        if (kapaliIsSayisi) { this.KapaliIsSayisi = kapaliIsSayisi; }
        if (hedefTarih) { this.HedefTarih = hedefTarih; }
        if (olusturmaTarihi) { this.OlusturmaTarihi = olusturmaTarihi; }
        if (guncellemeTarihi) { this.GuncellemeTarihi = guncellemeTarihi; }
        if (kapanmaTarihi) { this.KapanmaTarihi = kapanmaTarihi; }
    }
}