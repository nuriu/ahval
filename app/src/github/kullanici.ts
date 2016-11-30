import { Proje } from "./proje";

/**
 * Main user class for storing GitHub user info and actions for it.
 */
export class Kullanici {
    /**
     * GitHub username.
     */
    public KullaniciAdi: string;
    /**
     * User name info.
     */
    public Ad: string;
    /**
     * User bio info.
     */
    public Bio: string;
    /**
     * Link of user avatar.
     */
    public Avatar: string;
    /**
     * User company info.
     */
    public Sirket: string;
    /**
     * User location info.
     */
    public Yer: string;
    /**
     * Web page of user.
     */
    public Site: string;
    /**
     * Followers count of user.
     */
    public TakipciSayisi: number;
    /**
     * Count of people which user follows.
     */
    public TakipEdilenKisiSayisi: number;
    /**
     * Projects (repos) of user.
     */
    public Projeler: Proje[];

    /**
     * Creates user object with given info.
     * @param kAdi Username (used for login) of the user.
     * @param ad Name of the user.
     * @param bio Info at bio field of the user.
     * @param avatar Avatar link of the user.
     * @param sirket Company info of the user.
     * @param yer Location info of the user.
     * @param site Web adress of the user.
     * @param takipciSayisi Follower count of the user.
     * @param takipEdilenKisiSayisi Following count of the user.
     */
    constructor(kAdi: string, ad: string, bio: string, avatar: string, sirket: string, yer: string, site: string,
                takipciSayisi: number, takipEdilenKisiSayisi: number) {
        this.KullaniciAdi = kAdi;
        this.Ad = ad;
        this.Bio = bio;
        this.Avatar = avatar;
        this.Sirket = sirket;
        this.Yer = yer;
        this.Site = site;
        this.TakipciSayisi = takipciSayisi;
        this.TakipEdilenKisiSayisi = takipEdilenKisiSayisi;
        this.Projeler = new Array<Proje>();
    }
}
