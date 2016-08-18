import { GithubTarihi } from "./tarih";

export class Katki {
    public Yapan: string; // TODO: KULLANICI OLACAK
    public Avatar: string; // TODO: KULLANICI OLACAK
    public Mesaj: string;
    public YapilanTarih: GithubTarihi;

    constructor(yapan: string, avatar: string, mesaj: string, yapilanTarih: GithubTarihi) {
        this.Yapan = yapan;
        this.Avatar = avatar;
        this.Mesaj = mesaj;
        this.YapilanTarih = yapilanTarih;
    }
}
