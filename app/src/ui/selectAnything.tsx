import * as React from "react";
import * as ReactDOM from "react-dom";

import { NonIdealState } from "@blueprintjs/core";

ReactDOM.render(
    <NonIdealState
        visual="one-column"
        className="pt-dark"
        title="Seçim Yapın"
        description="Lütfen yandaki menüden entegre etmek istediğiniz sistemi seçin."
    />,
    document.getElementById("selectAnything")
);
