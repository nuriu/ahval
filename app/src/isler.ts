/// <reference path="../../typings/index.d.ts" />

var fs = require("fs");
var SQL = require("sql.js");

var fb = fs.readFileSync(`${__dirname}/db/veritabani`);
var db = new SQL.Database(fb);


var tariheGoreTumNotlar = db.exec("SELECT * FROM NOTLAR ORDER BY TARIH ASC")[0].values;
console.log(tariheGoreTumNotlar);

$(function () {
    notlariListele();
});

function notlariListele() {
    for (let indis = 0; indis < tariheGoreTumNotlar.length; indis++) {
        let eleman = tariheGoreTumNotlar[indis];
        let ifade: String = "<li>";

        if (eleman[4] == 1) {
            if (eleman[3] != 0) {
                let etiketinRengi: String = db.exec("SELECT RENK FROM ETIKETLER WHERE ID=" + eleman[3])[0].values[0];
                ifade += "<div class='bitmis is' id='" + eleman[0] + "' style='border-right: 8px solid " + etiketinRengi + ";'>";
            } else {
                ifade += "<div class='bitmis is' id='" + eleman[0] + "'>";
            }
            ifade += "<h3>" + eleman[1] + "<span>" + eleman[2] + "</span></h3>";
        } else {
            if (eleman[3] != 0) {
                let etiketinRengi: String = db.exec("SELECT RENK FROM ETIKETLER WHERE ID=" + eleman[3])[0].values[0];
                ifade += "<div class='is' id='" + eleman[0] + "' style='border-right: 8px solid " + etiketinRengi + ";'>";
            } else {
                ifade += "<div class='is' id='" + eleman[0] + "'>";
            }
            ifade += "<h2>" + eleman[1] + "<span>" + eleman[2] + "</span></h2>";
        }
        
        ifade += "</div></li>";
        document.getElementById("siralanabilir").innerHTML += ifade;
    }
}