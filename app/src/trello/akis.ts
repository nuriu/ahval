$(document).ready(() => {
    Trello.get("members/me", (k) => {
        console.log(k);
    });
});
