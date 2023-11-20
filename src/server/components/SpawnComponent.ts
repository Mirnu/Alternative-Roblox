import { OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { LevelService } from "server/services/LevelService";
import { mapGame } from "shared/Abbreviations/Map";
import { Alternative1 } from "server/components/Alternatives/1";
import { ReplicatedStorage } from "@rbxts/services";

interface Attributes {}

type level = 1;

@Component({
    tag: "Spawn",
})
export class SpawnComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
    public alternative?: BasePart;

    constructor(private levelService: LevelService, private components: Components) {
        super();
    }

    onStart() {
        this.levelService.GameStarted.Connect((level: number) => this.GameStart(level as level));
    }

    public Hide() {
        if (this.alternative === undefined) return;
        this.alternative.Parent = ReplicatedStorage.Temp.Alternatives;
    }

    public Show() {
        if (this.alternative === undefined) return;
        this.alternative.Parent = mapGame.Alternative;
    }

    private GameStart(level: level) {
        this.alternative = ReplicatedStorage.Prefabs.Alternatives[level].Clone();
        this.alternative.Parent = mapGame.Alternative;
        this.alternative.CFrame = this.instance.CFrame;
        this.components.addComponent<Alternative1>(this.alternative);
    }
}
