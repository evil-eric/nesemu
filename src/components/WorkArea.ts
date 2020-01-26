import {Component, VDomNode, WebComponent} from "../rendering/Component";

@Component("work-area")
export class WorkArea extends WebComponent {
    private color: string = "green";

    constructor() {
        super();
    }

    public render(): VDomNode {
        const ns = "http://www.w3.org/2000/svg";
        return this.$tn("svg", ns, {width: "5in", height: "5in", onClick: () => this.clicked()},
            this.$tn("circle", ns, {"cx": "0", "cy": "0", "r": "1in", "stroke": this.color, "stroke-width": ".1in", "fill": "yellow"}),
        );
    }

    public clicked() {
        if(this.color === "green") {
            this.color = "blue";
        } else {
            this.color = "green";
        }
        this.redraw();
    }
}
