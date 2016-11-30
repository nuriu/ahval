export class TrelloIstemci {
    private Anahtar: string;

    constructor() {
        this.Anahtar = window["trllKey"];

        Trello.authorize({
            name: "Ajanda",
            scope: {
                read: "true",
                write: "true",
            },
            type: "popup",
            webPreferences: {
                nodeIntegration: false,
            },
            expiration: "never",
            success: function () { console.log("Trello yetkilendirmesi başarılı!"); },
            error: function () { console.log("Trello yetkilendirmesi başarısız"); }
        });

        $("#icerik").load("./app/ui/trello.html");
    }
}
