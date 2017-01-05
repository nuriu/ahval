/**
 * GitHub client class.
 */
export class GitHub {
    /**
     * GitHub username.
     */
    public username: string;
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
    private client: any;

    /**
     * Creates client object.
     */
    constructor() {
        this.client = (<any> window).github;
    }

    /**
     * Set client id.
     */
    public setID(id: string) {
        this.id = id;
    }

    /**
     * Set cliend secret id.
     */
    public setSecret(secret: string) {
        this.secret = secret;
    }

    /**
     * Set client token.
     */
    public setToken(token: string) {
        this.token = token;
    }

    /**
     * @return(s) Client token.
     */
    public getToken() {
        return this.token;
    }

    /**
     * Authenticates client with given token.
     * @param gitHubToken github token for oauth authentication. 
     */
    public authenticate(gitHubToken: string) {
        this.client.authenticate({
            token: gitHubToken,
            type: "oauth",
        });
    }

    /**
     * Get Authenticated GitHub user and create Kullanici object..
     */
    public getUser() {
        this.client.users.get({}, (error: any, data: any) => {
            if (!error) {
                console.log(data);
            } else {
                console.log(error);
            }
        });
    }

    /**
     * Get events.
     */
    public getStream() {
        let ifade: string = "";
        this.client.activity.getEventsReceived({
            username: this.username,
        }, (error: any, data: any) => {
            if (!error) {
                console.log(data);
            } else {
                console.log(error);
            }
        });
    }
}