import { Injectable } from "@angular/core";

import { Http, Headers } from "@angular/http";

/**
 * File system.
 */
const fs = require("fs");

/**
 * Services that provides github api calls.
 */
@Injectable()
export class GitHubService {
    /**
     * Status of service.
     */
    activated: boolean = false;

    /**
     * Auth string.
     */
    auth: string;

    constructor(private _http: Http) {
        this.activate();
    }

    /**
     * Activates this service.
     */
    activate() {
        fs.readFile("keys.json", "utf8", (err, data) => {
            if (err) {
                console.log(err);
                this.activated = false;
            } else {
                this.auth = btoa(JSON.parse(data).github.user + ":" + JSON.parse(data).github.token);
                this.activated = true;
            }
        });
    }

    /**
     * Get github user info.
     */
    getUser() {
        let h = new Headers();
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/user", {
            headers: h
        }).map(res => res.json());
    }

    /**
     * Get active users avatar url.
     */
    getUserAvatarLink() {
        let h = new Headers();
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/user", {
            headers: h
        }).map(res => res.json().avatar_url);
    }

}
