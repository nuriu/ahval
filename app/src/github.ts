/**
 * GitHub client class.
 */
export class GitHub {
    private id: string;
    private secret: string;
    private token: string;

    public idBelirle(id: string) {
        this.id = id;
    }

    public secretBelirle(secret: string) {
        this.secret = secret;
    }

    public tokenBelirle(token: string) {
        this.token = token;
    }

    public tokeniGetir() {
        return this.token;
    }
}