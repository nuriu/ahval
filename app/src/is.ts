/// <reference path="../../typings/index.d.ts" />

import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
import { Olay } from "./olay";
import { Turler } from "./olay";
import { Proje } from "./proje";
import { GithubTarihi } from "./tarih";
import { Yorum } from "./yorum";

/**
 * Issue class.
 */
export class Is {
    /**
     * Issue number.
     */
    public No: number;
    /**
     * Related project (repo).
     */
    public Proje: Proje;
    /**
     * Issue title.
     */
    public Baslik: string;
    /**
     * Body of the issue.
     */
    public Icerik: string;
    /**
     * Issue status.
     */
    public Durum: string;
    /**
     * Issue label list.
     */
    public Etiketler: Array<Etiket>;
    /**
     * Issue event list.
     */
    public Olaylar: Array<Olay>;
    /**
     * Issue comment list.
     */
    public Yorumlar: Array<Yorum>;
    /**
     * Issue milestone.
     */
    public Hedef: Hedef;
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
     * GitHub client.
     */
    private github = window["github"];

    /**
     * Creates issue object with given infos.
     * @param no Issue number.
     * @param proje Related project (repo) object.
     * @param baslik Issue title.
     * @param icerik Issue body.
     * @param durum Issue status.
     * @param olusturmaTarihi Creation date.
     * @param guncellemeTarihi Update date.
     * @param kapanmaTarihi Close date.
     */
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
}
