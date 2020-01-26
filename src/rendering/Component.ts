import {BrowserWindow, remote} from "electron";

type BaseType = new(...args: any[]) => {};

export interface IVDom {
    type: string;
    attrs: object;
    ns?: string;
    children: Array<IVDom|string>;
}

export type VDomNode = IVDom | string;
type DomParent = HTMLElement|ShadowRoot|ChildNode;

const VDomChanged = (a: VDomNode, b: VDomNode) => {
    return typeof a !== typeof b ||
        typeof a === "string" && a !== b ||
        (a as IVDom).type !== (b as IVDom).type;
};

const extractEventName = (name: string) => name.slice(2).toLowerCase();

export abstract class WebComponent extends HTMLElement {
    // TODO: Replace this with an IWindow
    protected window: BrowserWindow;
    protected shadowDom: ShadowRoot;
    protected props: any[];
    protected state: object;
    protected vdom: VDomNode;

    constructor(props?: any[]) {
        super();

        this.window = remote.getCurrentWindow();
        this.shadowDom = this.attachShadow({ mode: "open" });
    }

    public connectedCallback() {
        this.redraw();
    }

    public redraw() {
        this.$d();
    }

    public setState(state: object) {
        this.state = Object.assign({}, state);
        this.$d();
    }

    public abstract render(): VDomNode;

    protected $t(nodeName: string, attrs?: object, ...children: VDomNode[]): IVDom {
        attrs = attrs||{};
        return {
            attrs,
            children,
            type: nodeName,
        };
    }

    protected $tn(nodeName: string, namespace: string, attrs?: object, ...children: VDomNode[]): IVDom {
        attrs = attrs||{};
        return {
            attrs,
            children,
            ns: namespace,
            type: nodeName,
        };
    }

    protected $d(): void {
        const newDom = this.render();
        this.$updateElement(this.shadowDom, newDom, this.vdom);
        this.vdom = newDom;
    }

    private $el(node: IVDom): HTMLElement|Element {
        if(node.ns) {
            return document.createElementNS(node.ns, node.type);
        }
        return document.createElement(node.type);
    }
    private $r(vNode: VDomNode): HTMLElement|Text {
        if(typeof vNode === "string") {
            return document.createTextNode(vNode);
        }
        const el = this.$el(vNode) as HTMLElement;
        this.$setProps(el, vNode.attrs);
        this.$addEventListeners(el, vNode.attrs);
        vNode.children.map((c) => this.$r(c)).forEach(el.appendChild.bind(el));
        return el;
    }

    private $isEventProp(name: string) {
        return /^on/.test(name);
    }

    private $addEventListeners(target: HTMLElement, props: object) {
        Object.keys(props).forEach((name) => {
            if(this.$isEventProp(name)) {
                target.addEventListener(
                    extractEventName(name),
                    (props as any)[name].bind(this),
                );
            }
        });
    }

    private $setBooleanProp(target: HTMLElement, name: string, value: boolean) {
        if(value) {
            target.setAttribute(name, value.toString());
            (target as any)[name] = true;
        } else {
            (target as any)[name] = false;
        }
    }

    private $removeBooleanProp(target: HTMLElement, name: string, value: boolean) {
        target.removeAttribute(name);
        (target as any)[name] = false;
    }

    private $setProp(target: HTMLElement, name: string, value: string|boolean) {
        if(name === "className") {
            target.setAttribute("class", value as string);
        } else if(typeof value === "boolean") {
            this.$setBooleanProp(target, name, value);
        } else {
            target.setAttribute(name, value);
        }
    }

    private $removeProp(target: HTMLElement, name: string, value: string|boolean) {
        if(name === "className") {
            target.removeAttribute("class");
        } else if(typeof value === "boolean") {
            this.$removeBooleanProp(target, name, value);
        } else {
            target.removeAttribute(name);
        }
    }

    private $setProps(target: HTMLElement, props: object) {
        Object.keys(props).forEach((name) => {
            this.$setProp(target, name, (props as any)[name]);
        });
    }

    private $updateElement(parent: DomParent, newNode: VDomNode, oldNode: VDomNode, index: number = 0) {
        if(!oldNode) {
            parent.appendChild(this.$r(newNode));
        } else if(!newNode) {
            parent.removeChild(parent.childNodes[index]);
        } else if(VDomChanged(newNode, oldNode)) {
            parent.replaceChild(this.$r(newNode), parent.childNodes[index]);
        } else if(typeof newNode !== "string" && typeof oldNode !== "string") {
            this.$updateProps(parent.childNodes[index] as HTMLElement, newNode.attrs, oldNode.attrs);
            const newLen = newNode.children.length;
            const oldLen = oldNode.children.length;

            for(let i = 0; i < newLen || i < oldLen; ++i) {
                this.$updateElement(parent.childNodes[index],
                    newNode.children[i],
                    oldNode.children[i],
                    i,
                );
            }
        }
    }

    private $updateProp(target: HTMLElement, name: string, newVal: boolean|string, oldVal: boolean|string) {
        if(!newVal) {
            this.$removeProp(target, name, oldVal);
        } else if(!oldVal || oldVal !== newVal) {
            this.$setProp(target, name, newVal);
        }
    }

    private $updateProps(target: HTMLElement, newProps: object, oldProps?: object) {
        oldProps = oldProps||{};
        const props = Object.assign({}, newProps, oldProps);
        Object.keys(props).forEach((name) => {
            this.$updateProp(target, name, (newProps as any)[name], (oldProps as any)[name]);
        });
    }
}

export const Component = (name: string) => {
    return <T extends WebComponent>(component: T|BaseType) => {
        customElements.define(name, component as BaseType);
    };
};
