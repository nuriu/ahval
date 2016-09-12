/**
 * Handler class for date and time formatting.
 */
export class GithubTarihi {
    /**
     * Hour.
     */
    public Saat: string = "";
    /**
     * Day.
     */
    public Gun: string = "";
    /**
     * Month.
     */
    public Ay: string = "";
    /**
     * Year.
     */
    public Yil: string = "";
    /**
     * Date.
     */
    public Tarih: string = "";

    /**
     * Creates formatted date and time info with given string.
     * @param tarih GitHub date string.
     */
    constructor(tarih: string) {
        if (tarih !== null) {
            for (let i = 0; i < tarih.length; i++) {
                if (tarih[i] !== "-") {
                    if (i >= 0 && i < 4) {
                        this.Yil += tarih[i];
                    } else if (i >= 4 && i < 7) {
                        this.Ay += tarih[i];
                    } else if (i >= 7 && i < 10) {
                        this.Gun += tarih[i];
                    } else if (i >= 11 && i < 16) {
                        this.Saat += tarih[i];
                    }
                }
            }
            this.Tarih = this.Gun + "." + this.Ay + "." + this.Yil + " | " + this.Saat;
        } else {
            this.Saat = null;
            this.Gun = null;
            this.Ay = null;
            this.Yil = null;
            this.Tarih = null;
        }
    }
}
