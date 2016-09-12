import { GithubTarihi } from "./tarih";

/**
 * Milestone class.
 */
export class Hedef {
    /**
     * Milestone ID.
     */
    public No: number;
    /**
     * Status of the milestone.
     */
    public Durum: string;
    /**
     * Title of the milestone.
     */
    public Baslik: string;
    /**
     * Creator username of the milestone.
     */
    public Olusturan: string; // TODO: KULLANICI OLACAK
    /**
     * Description for the milestone.
     */
    public Aciklama: string;
    /**
     * Open issue count.
     */
    public AcikIsSayisi: number;
    /**
     * Closed issue count.
     */
    public KapaliIsSayisi: number;
    /**
     * Deadline of the milestone.
     */
    public HedefTarih: GithubTarihi;
    /**
     * Creation date.
     */
    public OlusturmaTarihi: GithubTarihi;
    /**
     * Update date.
     */
    public GuncellemeTarihi: GithubTarihi;
    /**
     * Close date.
     */
    public KapanmaTarihi: GithubTarihi;

    /**
     * Creates milestone object with given infos.
     * @param baslik Title.
     * @param no ID.
     * @param durum Status.
     * @param olusturan Creator username.
     * @param aciklama Description.
     * @param acikIsSayisi Open issue count.
     * @param kapaliIsSayisi Closed issue count.
     * @param hedefTarih Deadline.
     * @param olusturmaTarihi Creation date.
     * @param guncellemeTarihi Update date.
     * @param kapanmaTarihi Close date.
     */
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