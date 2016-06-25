/// <reference path="../../typings/index.d.ts" />

var $ = require('jquery');

$(function () {
    $("#sortable").sortable({
        placeholder: "ui-sortable-placeholder"
    });
});