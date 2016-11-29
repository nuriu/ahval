import { GithubTarihi } from "./tarih";

/**
 * Class for issue milestones.
 */
export class Katki {
    /**
     * Username of the creator.
     */
    public Yapan: string; // TODO: KULLANICI OLACAK
    /**
     * Avatar link of the creator.
     */
    public Avatar: string; // TODO: KULLANICI OLACAK
    /**
     * Description of the milestone.
     */
    public Mesaj: string;
    /**
     * Creation date of the milestone.
     */
    public YapilanTarih: GithubTarihi;

    /**
     * Creates new milestone with given info.
     * @param yapan Uername of the creator.
     * @param avatar Avatar link of the creator.
     * @param mesaj Description of the milestone.
     * @param yapilanTarih Creation date of the milestone.
     */
    constructor(yapan: string, avatar: string, mesaj: string, yapilanTarih: GithubTarihi) {
        this.Yapan = yapan;
        this.Avatar = avatar;
        this.Mesaj = mesaj;
        this.YapilanTarih = yapilanTarih;
    }
}
