/**
 * File system.
 */
const fs = require("fs");
/**
 * Electron.
 */
const electron = require("electron");
/**
 * Electron remote.
 */
const remote = electron.remote;
/**
 * Main window.
 */
const BrowserWindow = remote.BrowserWindow;

/**
 * GitHub client class.
 */
export class GitHub {
    /**
     * Singleton instance.
     */
    private static instance: GitHub;
    /**
     * GitHub username.
     */
    public username: string;
    /**
     * GitHub user.
     */
    public user: any;
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
     * Gets the instance of class.
     */
    static getInstance() {
        if (!GitHub.instance) {
            GitHub.instance = new GitHub();
        }

        return GitHub.instance;
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
            //token: this.token,
            //type: "token"
        });
    }

    /**
     * Get Authenticated GitHub user.
     */
    public getUser() {
        this.client.users.get((error: any, data: any) => {
            if (!error) {
                // console.log(data);

                if (!this.user) this.user = data;

                return this.user;
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

    /**
     * Activates GitHub.
     */
    public activateGitHub() {
        fs.readFile("keys.json", "utf8", (err: any, data: any) => {
            if (err) {
                return console.log(err);
            } else {
                this.setID(JSON.parse(data).github.client_id);
                this.setSecret(JSON.parse(data).github.secret_key);
                this.setToken(JSON.parse(data).github.token);

                /*
                if (window.localStorage.getItem("githubtoken") === null) {
                    this.loginWithGitHub(this.id, this.secret);
                } else {
                    this.authenticate(window.localStorage.getItem("githubtoken"));
                }
                */
            }
        });
    }

    /**
     * Login with GitHub.
     * @param id Client ID.
     * @param secret Client Secret Key.
     */
    private loginWithGitHub(id: string, secret: string) {
        console.log(id, secret);

        let options = {
            clientID: id,
            clientSecret: secret,
            context: ["repo", "user", "notifications", "gist"],
        };

        let authWindow = new BrowserWindow({
            center: true,
            height: 720,
            icon: __dirname + "/../img/is.png",
            show: false,
            width: 1200,
        });

        authWindow.setMenu(null);

        let githubUrl = "https://github.com/login/oauth/authorize?";
        let authUrl = githubUrl + "client_id=" + options.clientID + "&scope=" + options.context;
        authWindow.loadURL(authUrl);
        authWindow.show();

        function handleCall(url: string) {
            let rawCode = /code=([^&]*)/.exec(url) || null;
            let kod = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
            let error = /\?error=(.+)$/.exec(url);

            if (kod || error) {
                authWindow.destroy();
            }

            if (kod) {
                this.getTokenFromGitHub(options, kod);
            } else if (error) {
                alert("err! GitHub üyeliğiniz ile giriş yapmalısınız. Lütfen tekrar deneyin.");
            }
        }

        authWindow.webContents.on("will-navigate", (olay: any, url: string) => {
            handleCall(url);
        });

        authWindow.webContents.on("did-get-redirect-request", (olay: any, eskiUrl: string, yeniUrl: string) => {
            handleCall(yeniUrl);
        });

        authWindow.on("close", () => {
            authWindow = null;
        });
    }

    /**
     * Get token from GitHub.
     * @param options Options for auth.
     */
    private getTokenFromGitHub(options: any, kod: any) {
        let a = this.client.authenticate({
            type: "oauth",
            key: options.clientID,
            secret: options.clientSecret
        });
        console.log(a)
        $.post("https://github.com/login/oauth/access_token", {
            client_id: options.clientID,
            client_secret: options.clientSecret,
            code: kod,
        }).done((data: string, status: string) => {
            /*
            console.log(status);
            console.log(data.slice(data.search("=") + 1, data.search("&")));
            */

            if (status === "success") {
                window.localStorage.setItem("githubtoken", data.slice(data.search("=") + 1, data.search("&")));
                this.authenticate(data.slice(data.search("=") + 1, data.search("&")));
            }
        });
    }

    private constructor() {
        this.client = (<any>window).github;
    }

}
