/// <reference path="../../typings/index.d.ts" />

var fs = require("fs");
var SQL = require("sql.js");

var fb = fs.readFileSync(`${__dirname}/db/veritabani`);
var db = new SQL.Database(fb);


var tariheGoreTumNotlar = db.exec("SELECT * FROM NOTLAR ORDER BY TARIH ASC");
console.log(tariheGoreTumNotlar[0].values);

$(function () {
    notlariListele();
});

function notlariListele() {
    for (let indis = 0; indis < tariheGoreTumNotlar[0].values.length; indis++) {
        let eleman = tariheGoreTumNotlar[0].values[indis];
        let ifade: String = "<li>";

        // TAMAMLANMA DURUMU
        if (eleman[4] == 1)
            ifade += "<input id='" + eleman[0] + "' type='checkbox' checked />";
        else
            ifade += "<input id='" + eleman[0] + "' type='checkbox' />";        

        // ETİKET DURUMU
        if (eleman[3] != 0) {
            let etiketinRengi: String = db.exec("SELECT RENK FROM ETIKETLER WHERE ID="+ eleman[3])[0].values[0];            
            ifade += "<label for='" + eleman[0] + "' style='border-right: 8px solid " + etiketinRengi + ";'>";
        } else {
            ifade += "<label for='" + eleman[0] + "'>";
        }

        ifade +="\
        <h2>" + eleman[1] + "<i class='resize vertical icon' style='float:right;'></i><span>" + eleman[2] + "</span></h2>\
        </label></li>";

        document.getElementById("siralanabilir").innerHTML += ifade;
    }
}