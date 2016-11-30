$(document).ready(() => {
    Trello.get("members/me/boards", (panolar) => {
        panolar.forEach(pano => {
            console.log(pano);
            if (pano.starred) {
                yildizliPanoEkle(pano);
            } else if (!pano.idOrganization) {
                kisiselPanoEkle(pano);
            }
        });
    });
});

function yildizliPanoEkle(pano: any) {
    let kod: string;

    kod = '<div class="column"><div class="ui fluid card">';
    kod += '<div class="content">';
    kod += '<div class="header">' + pano.name + "</div>";
    kod += '<div class="description">' + pano.desc + "</div>";
    kod += "</div>";
    kod += '<div class="ui bottom attached button" id="' + pano.id + '">Panoya Geç</div>';
    kod += "</div></div>";

    $("#yildizliPanolar").append(kod);
}

function kisiselPanoEkle(pano: any) {
    let kod: string;

    kod = '<div class="column"><div class="ui fluid card">';
    kod += '<div class="content">';
    kod += '<div class="header">' + pano.name + "</div>";
    kod += '<div class="description">' + pano.desc + "</div>";
    kod += "</div>";
    kod += '<div class="ui bottom attached button" id="' + pano.id + '">Panoya Geç</div>';
    kod += "</div></div>";

    $("#kisiselPanolar").append(kod);
}