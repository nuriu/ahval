import { Injectable } from "@angular/core";

/**
 * File system.
 */
const fs = require("fs");
/**
 * Github api client.
 */
const octonode = require("octonode");

/**
 * Services that provides github api calls.
 */
@Injectable()
export class GitHubService {
    activated: boolean = false;
    client: any = null;
    user: any = null;

    constructor() {
        this.activate();
    }

    activate() {
        fs.readFile("keys.json", "utf8", (err, data) => {
            if (err) {
                console.log(err);
                this.activated = false;
            } else {
                this.client = octonode.client(JSON.parse(data).github.token);
                this.activated = true;
            }
        });
    }

    getUser() {
        if (this.activated) {
            this.client.get("/user", {}, (err, status, body, headers) => {
                this.user = body;
                return this.user;
            });
        } else {
            fs.readFile("keys.json", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    this.activated = false;
                } else {
                    this.client = octonode.client(JSON.parse(data).github.token);
                    this.activated = true;
                    this.client.get("/user", {}, (err, status, body, headers) => {
                        this.user = body;
                        return this.user;
                    });
                }
            });
        }
    }

    getUserAvatarLink() {
        if (this.user) {
            return this.user.avatar_url;
        } else {
            if (this.activated) {
                this.client.get("/user", {}, (err, status, body, headers) => {
                    this.user = body;
                    return this.user.avatar_url;
                });
            } else {
                fs.readFile("keys.json", "utf8", (err, data) => {
                    if (err) {
                        console.log(err);
                        this.activated = false;
                    } else {
                        this.client = octonode.client(JSON.parse(data).github.token);
                        this.activated = true;
                        this.client.get("/user", {}, (err, status, body, headers) => {
                            this.user = body;
                            return this.user.avatar_url;
                        });
                    }
                });
            }
        }
    }

}
