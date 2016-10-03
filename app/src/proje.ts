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
}
