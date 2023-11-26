import { Component } from "@flamework/components";
import { AlternativeComponent } from "./AlternativeComponent";

const damage = -1;

@Component()
export class Alternative1 extends AlternativeComponent {
    constructor() {
        super();
        this.damage = damage;
    }
}
