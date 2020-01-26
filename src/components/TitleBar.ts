import { Component, VDomNode, WebComponent } from "../rendering/Component";

@Component("title-bar")
export class TitleBar extends WebComponent {
    constructor() {
        super();
    }

    public render(): VDomNode {
        return this.$t("div", {},
            this.$t("style", {}, "* { padding: 0; margin: 0; box-sizing: border-box; } .title-bar { position: absolute; top: 0; left: 0; height: 30px; right: 0px; -webkit-app-region: drag; background-color: #333366; color: #cccc99; user-select: none; display: flex; align-items: center; justify-content: left; overflow:visible; white-space: normal; zoom: 1; flex-shrink: 0; } .title-bar .title { flex-basis: auto; flex-grow: 0; flex-shrink: 1; white-space: nowrap; text-overflow: ellipsis; font-size: 12px; cursor: default; margin: 0 auto; } :host-context(.mac) .title-bar .windows-controls { display: none; } .title-bar .windows-controls { position: absolute; right: 0; -webkit-app-region: no-drag; } .title-bar .windows-controls .windows-control-bg { position: relative; display: inline-block; -webkit-mask-clip: border-box; text-align: center; font-size: 13px; } .title-bar .windows-controls .windows-control{ color: #fff; background-color: #fff; width: 40px; height: 30px; } .title-bar .windows-controls .windows-control.minimize { -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%; } .title-bar .windows-controls .windows-control.unmaximize { -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%; } .title-bar .windows-controls .windows-control.maximize { -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%; } .title-bar .windows-controls .windows-control.close { -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%; } .title-bar .windows-controls .windows-control-bg:hover { background-color: #66c; } .title-bar .windows-controls .windows-control-close-bg:hover { background-color: red; }"),
            this.$t("header", {part: "title-bar", className: "title-bar"},
                this.$t("div", {part: "title-bar", className: "icon"}),
                this.$t("slot", {name: "menu"}),
                this.$t("div", {part: "title-bar", className: "title"},
                    this.$t("slot", {name: "title"}),
                ),
                this.$t("div", {part: "title-bar", className: "windows-controls"},
                    this.$t("div", {part: "title-bar", className: "windows-control-bg"},
                        this.$t("div", {part: "title-bar", className: "windows-control minimize", onClick: this.minimize}),
                    ),
                    this.$t("div", {part: "title-bar", className: "windows-control-bg"},
                        this.$t("div", {part: "title-bar", className: "windows-control maximize", onClick: this.maximize}),
                    ),
                    this.$t("div", {part: "title-bar", className: "windows-control-bg windows-control-close-bg"},
                        this.$t("div", {part: "title-bar", className: "windows-control close", onClick: this.close}),
                    ),
                ),
            ),
        );
    }

    private close(): void {
        this.window.close();
    }

    private minimize(): void {
        this.window.minimize();
    }

    private maximize(): void {
        const maxEl = this.shadowDom.querySelector(".maximize");
        const unmaxEl = this.shadowDom.querySelector(".unmaximize");

        if(this.window.isMaximized()) {
            this.window.unmaximize();
            unmaxEl.classList.remove("unmaximize");
            unmaxEl.classList.add("maximize");
        } else {
            this.window.maximize();
            maxEl.classList.remove("maximize");
            maxEl.classList.add("unmaximize");
        }
    }
}
