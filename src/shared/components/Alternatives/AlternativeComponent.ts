import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({})
export class AlternativeComponent extends BaseComponent<{}, Instance> implements OnStart {
    public damage?: number;

    onStart() {}
}
