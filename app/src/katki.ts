import { GithubTarihi } from "./tarih";

export class Katki {
    public Yapan: string;
    public Avatar: string;
    public Mesaj: string;
    public YapilanTarih: GithubTarihi;

    constructor(yapan: string, avatar: string, mesaj: string, yapilanTarih: GithubTarihi) {
        this.Yapan = yapan;
        this.Avatar = avatar;
        this.Mesaj = mesaj;
        this.YapilanTarih = yapilanTarih;
    }
}
