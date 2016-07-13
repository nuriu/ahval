$(document).ready(function () {

  // saniye
  setInterval(function () {
    let saniye = new Date().getSeconds();
    $("#saniye").html((saniye < 10 ? "0" : "") + saniye);
  }, 1000);

  // dakika
  setInterval(function () {
    let dakika = new Date().getMinutes();
    $("#dakika").html((dakika < 10 ? "0" : "") + dakika);
  }, 1000);

  // saat
  setInterval(function () {
    let saat = new Date().getHours();
    $("#saat").html((saat < 10 ? "0" : "") + saat);
  }, 1000);

  // gün
  document.getElementById("gun").innerHTML = new Date().getDate().toString();

  // ay
  let ay = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"][new Date().getMonth()];
  document.getElementById("ay").innerHTML = ay;

  // yıl
  document.getElementById("yil").innerHTML = new Date().getUTCFullYear().toString();

});