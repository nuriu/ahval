/// <reference path="../../typings/index.d.ts" />

var KULLANICI: any;

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
            gitHubBilgileriniYazdir();
        }); 
    }
}

function gitHubBilgileriniYazdir() {
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