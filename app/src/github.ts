import { Kullanici } from "./kullanici";

/**
 * GitHub client class.
 */
export class GitHub {
    /**
     * GitHub User.
     */
    public Kullanici: Kullanici;
    /**
     * Client id.
     */
    private id: string;
    /**
     * Client secret id.
     */
    private secret: string;
    /**
     * Client token.
     */
    private token: string;
    /**
     * Client.
     */
    private istemci: any;

    /**
     * Creates client object.
     */
    constructor() {
        this.istemci = window["github"];
    }

    /**
     * Set client id.
     */
    public idBelirle(id: string) {
        this.id = id;
    }

    /**
     * Set cliend secret id.
     */
    public secretBelirle(secret: string) {
        this.secret = secret;
    }

    /**
     * Set client token.
     */
    public tokenBelirle(token: string) {
        this.token = token;
    }

    /**
     * @return(s) Client token.
     */
    public tokeniGetir() {
        return this.token;
    }

    /**
     * Authenticates client with given token.
     * @param gitHubToken github token for oauth authentication. 
     */
    public authenticate(gitHubToken: string) {
        this.istemci.authenticate({
            token: gitHubToken,
            type: "oauth",
        });
    }

    /**
     * Get Authenticated GitHub user and create Kullanici object..
     */
    public kullaniciyiGetir() {
        this.istemci.users.get({}, (hata, veri) => {
            if (!hata) {
                this.Kullanici = new Kullanici(veri.login, veri.name, veri.bio, veri.avatar_url, veri.company, veri.location,
                    veri.blog, veri.followers, veri.following);
                console.log(veri);
                console.log(this.Kullanici);
            } else {
                console.log(hata);
            }
        });
    }
}
