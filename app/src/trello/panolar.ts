$(document).ready(() => {
    Trello.get("members/me/organizations", (organizasyonlar) => {
        organizasyonlar.forEach(organizasyon => {
            console.log(organizasyon);
            organizasyonAlanlariniOlustur(organizasyon);
        });
    });
    Trello.get("members/me/boards", (panolar) => {
        panolar.forEach(pano => {
            console.log(pano);
            if (pano.starred) {
                yildizliPanoEkle(panoAlaniniOlustur(pano));
            }
            if (!pano.idOrganization) {
                kisiselPanoEkle(panoAlaniniOlustur(pano));
            }
            if (pano.idOrganization) {
                organizasyonPanosuEkle(pano.idOrganization, panoAlaniniOlustur(pano));
            }
        });
    });
});

function organizasyonAlanlariniOlustur(organizasyon: any) {
    let kod: string;

    kod = '<h3><i class="teal users icon"></i> <small>' + organizasyon.displayName + "</small></h3>";
    kod += '<div class="ui three column grid" id="' + organizasyon.id + '"></div>';

    $("#panolar").append(kod);
}

function panoAlaniniOlustur(pano: any): string {
    let kod: string;

    kod = '<div class="column"><div class="ui fluid card">';
    kod += '<div class="content">';
    kod += '<div class="header">' + pano.name + "</div>";
    kod += '<div class="description">' + pano.desc + "</div>";
    kod += "</div>";
    kod += '<div class="ui bottom attached teal button" id="' + pano.id + '">Panoya Geç</div>';
    kod += "</div></div>";

    return kod;
}

function yildizliPanoEkle(kod: string) {
    $("#yildizliPanolar").append(kod);
}

function kisiselPanoEkle(kod: string) {
    $("#kisiselPanolar").append(kod);
}

function organizasyonPanosuEkle(organizasyonKimligi: string, kod: string) {
    $("#" + organizasyonKimligi).append(kod);
}