import { Injectable } from "@angular/core";
import { Http, Headers, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';

/**
 * Services that provides github api calls.
 */
@Injectable()
export class GitHubService {

    /**
     * Auth string.
     */
    auth: string;

    constructor(private _http: Http) {
        //this.activate();
    }

    /**
     * Activates this service.
     */
    activate() {
        //this.auth = btoa(JSON.parse(data).github.user + ":" + JSON.parse(data).github.token);
        // TODO: activate the service with outh.
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

    /**
     * Get repos of active github user.
     */
    getUserRepos(sort: string, direction: string) {
        let h = new Headers();
        let p = new URLSearchParams();
        p.set("sort", sort);
        p.set("direction", direction);
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/user/repos", {
            headers: h,
            search: p
        }).map(res => res.json());
    }

    /**
     * Get stream of active github user.
     */
    getUserReceivedEvents(login: string, page: number) {
        let h = new Headers();
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/users/" + login + "/received_events?page=" + page, {
            headers: h
        }).map(res => res.json());
    }

    /**
     * Get list who a user is following.
     */
    getFollowingUsers(login: string) {
        let h = new Headers();
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/users/" + login + "/following", {
            headers: h
        }).map(res => res.json());
    }

    /**
     * Get list of a user's followers.
     */
    getFollowers(login: string) {
        let h = new Headers();
        h.set("Authorization", "Basic " + this.auth);
        return this._http.get("https://api.github.com/users/" + login + "/followers", {
            headers: h
        }).map(res => res.json());
    }
}
