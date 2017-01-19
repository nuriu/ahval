import { Component } from "@angular/core";

@Component({
  selector: "sidebar",
  template: `
    <div class="ui left visible vertical inverted very thin sidebar icon menu" id="menu">
        <a class="item" style="padding-left:13px;" id="GitHub">
            <i class="big github icon"></i>
        </a>
        <a class="item" style="padding-left:13px;" id="GitLab">
            <i class="big orange gitlab icon"></i>
        </a>
        <a class="item" style="padding-left:13px;" id="Bitbucket">
            <i class="big blue bitbucket icon"></i>
        </a>
        <a class="item" style="padding-left:13px;" id="Trello">
            <i class="big teal trello icon"></i>
        </a>
    </div>
  `
})
export class SidebarComponent { }
