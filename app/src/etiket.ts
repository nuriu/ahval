import { Is } from "./is";

/**
 * Class for issue labels.
 */
export class Etiket {
    /**
     * Related Is (label) object.
     */
    public Is: Is;
    /**
     * Name of the label.
     */
    public Ad: string;
    /**
     * Color code of the label.
     */
    public Renk: string;

    /**
     * Creates new label object with given info.
     * @param is Is object which this label belongs to.
     * @param ad Name for the label.
     * @param renk Color code for the label. 
     */
    constructor(is: Is, ad: string, renk: string) {
        this.Is = is;
        this.Ad = ad;
        this.Renk = "#" + renk;
    }
}