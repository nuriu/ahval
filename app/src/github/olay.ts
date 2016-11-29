import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
import { Is } from "./is";
import { GithubTarihi } from "./tarih";

/**
 * Issue related event types.
 */
export const enum Turler {
    /**
     * Adding label.
     */
    EtiketEkleme,
    /**
     * Removing label.
     */
    EtiketKaldirma,
    /**
     * Assigning to the user.
     */
    KisiyeAtama,
    /**
     * Unassigning from the user.
     */
    KisidenAlma,
    /**
     * Closing.
     */
    Kapatma,
    /**
     * Reopening.
     */
    TekrarAcma,
    /**
     * Subscribing.
     */
    AboneOlma,
    /**
     * Mentioning.
     */
    Bahsetme,
    /**
     * Adding to the milestone.
     */
    HedefEkleme,
    /**
     * Removing from the milestone.
     */
    HedefKaldirma,
    /**
     * Renaming.
     */
    YenidenAdlandirma,
    /**
     * Locking.
     */
    Kilitleme,
    /**
     * Unlocking.
     */
    KilidiAcma
}

/**
 * Event class for issue events.
 */
export class Olay {
    /**
     * Owner issue.
     */
    public Is: Is;
    /**
     * Event type.
     */
    public Tur: Turler;
    /**
     * Actor of the event.
     */
    public Aktor: string; // TODO: KULLANICI OLACAK
    /**
     * Avatar link of the actor.
     */
    public Avatar: string;
    /**
     * Occurrence date of the event.
     */
    public GerceklesmeTarihi: GithubTarihi;
    /**
     * Label object for labelling unlabelling events.
     */
    public Etiket: Etiket;
    /**
     * Assigner username. 
     */
    public Atayan: string; // TODO: KULLANICI OLACAK
    /**
     * Avatar link of the assigner. 
     */
    public AtayanAvatar: string;
    /**
     * Assignee username.
     */
    public Atanan: string; // TODO: KULLANICI OLACAK
    /**
     * Avatar link of the assignee.
     */
    public AtananAvatar: string;
    /**
     * Milestone object for milestone related events.
     */
    public Hedef: Hedef;
    /**
     * Previous name of the issue. For renaming events.
     */
    public OncekiAd: string;
    /**
     * New name of the issue. For renaming events.
     */
    public SonrakiAd: string;

    /**
     * Creates new event object with given info.
     * @param is Related issue.
     * @param olayTuru Event type.
     * @param aktor Event actor.
     * @param avatar Avatar link of the actor.
     * @param gerceklesmeTarihi Occurrence date.
     * @param etiket Label info.
     * @param atayan Assigner username.
     * @param atayanAvatar Avatar link of the assigner.
     * @param atanan Assignee username.
     * @param atananAvatar Avatar link of the assignee.
     */
    constructor(is: Is, olayTuru: string, aktor: string, avatar: string, gerceklesmeTarihi: GithubTarihi,
                etiket?: Etiket, atayan?: string, atayanAvatar?: string, atanan?: string, atananAvatar?: string) {
        this.Is = is;
        this.Aktor = aktor;
        this.Avatar = avatar;
        this.GerceklesmeTarihi = gerceklesmeTarihi;

        switch (olayTuru) {
            case "labeled":
                this.Tur = Turler.EtiketEkleme;
                break;
            case "unlabeled":
                this.Tur = Turler.EtiketKaldirma;
                break;
            case "assigned":
                this.Tur = Turler.KisiyeAtama;
                break;
            case "unassigned":
                this.Tur = Turler.KisidenAlma;
                break;
            case "closed":
                this.Tur = Turler.Kapatma;
                break;
            case "reopened":
                this.Tur = Turler.TekrarAcma;
                break;
            case "subscribed":
                this.Tur = Turler.AboneOlma;
                break;
            case "mentioned":
                this.Tur = Turler.Bahsetme;
                break;
            case "milestoned":
                this.Tur = Turler.HedefEkleme;
                break;
            case "demilestoned":
                this.Tur = Turler.HedefKaldirma;
                break;
            case "renamed":
                this.Tur = Turler.YenidenAdlandirma;
                break;
            case "locked":
                this.Tur = Turler.Kilitleme;
                break;
            case "unlocked":
                this.Tur = Turler.KilidiAcma;
                break;
            default:
                break;
        }
    }
}