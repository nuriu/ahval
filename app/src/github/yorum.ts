import { GithubTarihi } from "./tarih";

/**
 * Comment class for the issue.
 */
export class Yorum {
    /**
     * Username of the commenter.
     */
    public Yapan: string;
    /**
     * Avatar link of the commenter.
     */
    public Avatar: string;
    /**
     * Text of the comment.
     */
    public Metin: string;
    /**
     * Creation date of the comment.
     */
    public YapilmaTarihi: GithubTarihi;
    /**
     * Update date of the comment.
     */
    public GuncellenmeTarihi: GithubTarihi;

    /**
     * Creates new comment with given info.
     * @param yapan Commenter username.
     * @param avatar Avatar link of the commenter.
     * @param metin Comment text.
     * @param yapilmaTarihi Creation date.
     * @param guncellemeTarihi Update date.
     */
    constructor(yapan: string, avatar: string, metin: string, yapilmaTarihi: GithubTarihi, guncellemeTarihi: GithubTarihi) {
        this.Yapan = yapan;
        this.Avatar = avatar;
        this.Metin = metin;
        this.YapilmaTarihi = yapilmaTarihi;
        this.GuncellenmeTarihi = guncellemeTarihi;
    }
}
