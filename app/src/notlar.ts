/// <reference path="../../typings/index.d.ts" />

var fs = require("fs");
var SQL = require("sql.js");

var fb = fs.readFileSync(`${__dirname}/db/veritabani`);
var db = new SQL.Database(fb);


var tn = db.exec("SELECT * FROM NOTLAR");
console.log(tn[0].values[0]);
