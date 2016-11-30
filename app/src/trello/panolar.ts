$(document).ready(() => {
    Trello.get("members/me/boards", (panolar) => {
        panolar.forEach(pano => {
            console.log(pano);
        });
    });
});
