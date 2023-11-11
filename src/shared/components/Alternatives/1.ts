import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { AlternativeComponent } from "./AlternativeComponent";

const damage = -1;

@Component()
export class Alternative1 extends AlternativeComponent implements OnStart {
    constructor() {
        super();
        this.damage = damage;
    }

    onStart() {}
}
