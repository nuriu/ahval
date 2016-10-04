import { GitHub } from "../github";

let github: GitHub;

$(document).ready(() => {
    github = window["gh"];
    github.akisiGetir();
});
