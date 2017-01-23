import { Component } from "@angular/core";

/**
 * Class for home component.
 */
@Component({
    selector: "home",
    template: `
    <div class="ui inverted segment" style="height=100%;">
        <h2 class="ui center aligned inverted icon header" style="padding-top:4em;">
            <i class="circular left arrow icon"></i>
        <br />
            Lütfen, etkinleştirmek istediğiniz bileşeni yan menüden seçiniz.
        </h2>
        <h5 class="ui center aligned header">
            s2.0.0 ile birlikte burada birleştirilmiş akışın gösterilmesi planlanmaktadır.
        </h5>
    </div>
    `
})
export class HomeComponent {}
