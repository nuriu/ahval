import { Component } from "@angular/core";

@Component({
  selector: "sidebar",
  templateUrl: "sidebar.component.html"
})

export class SidebarComponent {
    items: any[] = [
        {name: "GitHub", iconClass: "big github icon" },
        {name: "GitLab", iconClass: "big orange gitlab icon" },
        {name: "Bitbucket", iconClass: "big blue bitbucket icon" },
        {name: "Trello", iconClass: "big teal trello icon" }
    ];
}
