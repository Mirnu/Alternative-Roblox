import { Component, BaseComponent, Components } from "@flamework/components";
import { Alternative1 } from "server/components/Alternatives/1";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

interface Attributes {}

type level = 1;

@Component({})
export class SpawnComponent extends BaseComponent<Attributes, BasePart> {
    public alternative?: BasePart;

    constructor(private components: Components) {
        super();
    }

    private CanChange() {
        return (
            Workspace.FindFirstChild("Map")?.FindFirstChild("Alternative") === undefined ||
            this.alternative === undefined ||
            this.alternative.Parent === undefined
        );
    }

    public Hide() {
        if (this.CanChange()) return;
        this.alternative!.Parent = ReplicatedStorage.Temp.Alternatives;
    }

    public Show() {
        if (this.CanChange()) return;
        this.alternative!.Parent = Workspace.Map.Alternative;
    }

    public GameStart(level: level) {
        this.alternative = ReplicatedStorage.Prefabs.Alternatives[level].Clone();
        this.alternative.Parent = Workspace.Map.Alternative;
        this.alternative.CFrame = this.instance.CFrame;
        this.components.addComponent<Alternative1>(this.alternative);
    }
}
