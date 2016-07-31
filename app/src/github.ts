/// <reference path="../../typings/index.d.ts" />

var KULLANICI: any;
var PROJELER: any;

$(document).ready(function () {
    document.getElementById("projeListesi").innerHTML = "<li class='active'><a href='#'><i class='browser icon'></i> Tüm Notlar</a></li>";
});

$("#githubKullaniciAdi").keyup(function (e) {
    if (e.keyCode == 13) {
        gitHubBilgileriniGetir();
    }
});

function gitHubBilgileriniGetir() {
    let kullaniciAdi = (<HTMLInputElement>document.getElementById("githubKullaniciAdi")).value;

    if (kullaniciAdi.length) {
        $.get("https://api.github.com/users/" + kullaniciAdi, function (veri) {
            KULLANICI = veri;
            $.get(KULLANICI.repos_url, function (veri) {
                PROJELER = veri;
                gitHubProjeListesiniYazdir();
            });
            gitHubProfilBilgileriniYazdir();
        });
    }
}

function gitHubProfilBilgileriniYazdir() {
    if (KULLANICI) {
        document.getElementById("github").innerHTML = "<div class='ui list'><div class='item'>\
        <img class='ui tiny avatar image' src='"+ KULLANICI.avatar_url +"'>\
        <div class='content'>\
        <span class='header'>" + KULLANICI.name + "</span>\
        <div class='description'><i class='github icon'></i>" + KULLANICI.login + "<br>"
        + KULLANICI.bio +"<br>"
        + KULLANICI.company +"</div>\
        </div></div></div>";
        document.getElementById("github").innerHTML += "<br><div class='ui tiny three statistics'>\
        <div class='statistic'><div class='value'>" + KULLANICI.public_repos + "</div>\
        <div class='label'>PROJE</div></div>\
        <div class='statistic'><div class='value'>" + KULLANICI.followers + "</div>\
        <div class='label'>TAKİPÇİ</div></div>\
        <div class='statistic'><div class='value'>" + KULLANICI.following + "</div>\
        <div class='label'>TAKİP EDİLEN</div></div>\
        </div>";
    }
}
function gitHubProjeListesiniYazdir() {
    if (PROJELER) {
        //console.log(PROJELER);
        document.getElementById("projeListesiBaslik").innerHTML = "<i class='tasks icon'></i> Projeler (" + PROJELER.length + ")";
        for (var i = 0; i < PROJELER.length; i++) {
            let proje = PROJELER[i];
            $.get("https://api.github.com/repos/nuriu/" + proje.name + "/issues", function (veri) {
                if (veri != "") {
                    //console.log(veri);
                    document.getElementById("projeListesi").innerHTML += "<li><a href='#'>" + proje.name + " (" + veri.length + ")</a></li>";
                } else {
                    document.getElementById("projeListesi").innerHTML += "<li><a href='#'>" + proje.name + "</a></li>";
                }
            });
        }
    }
}