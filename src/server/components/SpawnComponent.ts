import { OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { LevelService } from "server/services/LevelService";
import { Prefabs, mapGame } from "shared/Abbreviations/Map";
import { Alternative1 } from "shared/components/Alternatives/1";

interface Attributes {}

type level = 1;

@Component({
    tag: "Spawn",
})
export class SpawnComponent extends BaseComponent<Attributes, BasePart> implements OnStart {
    private alternative?: BasePart;
    constructor(private levelService: LevelService, private components: Components) {
        super();
    }

    onStart() {
        this.levelService.GameStarted.Connect((level: number) => this.GameStart(level as level));
    }

    private GameStart(level: level) {
        this.alternative = Prefabs.Alternatives[level].Clone();
        this.alternative.Parent = mapGame.Alternative;
        this.alternative.CFrame = this.instance.CFrame;
        this.components.addComponent<Alternative1>(this.alternative);
    }
}
