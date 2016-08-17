import { GithubTarihi } from "./tarih";

export class Yorum {
    public Yapan: string;
    public Avatar: string;
    public Metin: string;
    public YapilmaTarihi: GithubTarihi;
    public GuncellenmeTarihi: GithubTarihi;

    constructor(yapan: string, avatar: string, metin: string, yapilmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi) {
        this.Yapan = yapan;
        this.Avatar = avatar;
        this.Metin = metin;
        this.YapilmaTarihi = yapilmaTarihi;
        this.GuncellenmeTarihi = guncellemeTarihi;
    }
}
