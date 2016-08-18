import { Etiket } from "./etiket";
import { Hedef } from "./hedef";
import { Is } from "./is";
import { GithubTarihi } from "./tarih";

export const enum Turler {
    EtiketEkleme,
    EtiketKaldirma,
    KisiyeAtama,
    KisidenAlma,
    Kapatma,
    TekrarAcma,
    AboneOlma,
    Bahsetme,
    HedefEkleme,
    HedefKaldirma,
    YenidenAdlandirma,
    Kilitleme,
    KilidiAcma
}

export class Olay {
    public Is: Is;
    public Tur: Turler;
    public Aktor: string; // TODO: KULLANICI OLACAK
    public Avatar: string;
    public GerceklesmeTarihi: GithubTarihi;
    // Etiket ekleme - kaldırma
    public Etiket: Etiket;
    // Kişiye atama - kişiden alma // TODO: KULLANICI OLACAK
    public Atayan: string; 
    public AtayanAvatar: string;
    public Atanan: string;
    public AtananAvatar: string;
    // Hedef ekleme - kaldırma
    public Hedef: Hedef;
    // Yeniden adlandırma
    public OncekiAd: string;
    public SonrakiAd: string;

    constructor(is: Is, olayTuru: string, aktor: string, avatar: string, gerceklesmeTarihi: GithubTarihi,
                etiket?: Etiket, atayan?: string, atayanAvatar?: string, atanan?: string, atananAvatar?: string
    ) {
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