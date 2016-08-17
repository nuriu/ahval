import { Is } from "./is";

export class Etiket {
    public Is: Is;
    public Ad: string;
    public Renk: string;

    constructor(is: Is, ad: string, renk: string) {
        this.Is = is;
        this.Ad = ad;
        this.Renk = "#" + renk;
    }
}