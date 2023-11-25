import { Service, OnStart, OnInit } from "@flamework/core";
import { LevelService } from "./LevelService";
import { Lighting, ReplicatedStorage, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { PlayerService } from "./PlayerService";
import { player } from "types/Player";
import { Events } from "server/network";
import { Components } from "@flamework/components";
import { SpawnComponent } from "server/components/SpawnComponent";

const TIME_DELAY = 0.1;
const TIME_DELTA = 0.002 * 20;

@Service({})
export class DayService implements OnStart {
    constructor(private levelService: LevelService, private components: Components) {}

    public FinishSignal = new Signal();

    onStart() {
        this.levelService.GameStarted.Connect(() => this.StartNightCycle());
    }

    private ClearLeftovers() {
        if (Workspace.Map.FindFirstChild("AlternativeSpawn")) {
            Workspace.Map.AlternativeSpawn.GetChildren().forEach((instance) => {
                this.components.removeComponent<SpawnComponent>(instance);
            });
        }
        ReplicatedStorage.Temp.Alternatives.GetChildren().forEach((instance) => {
            instance.Destroy();
        });
    }

    private StartNightCycle() {
        Lighting.ClockTime = 0;

        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(TIME_DELAY)) {
            Lighting.ClockTime += TIME_DELTA;

            if (Lighting.ClockTime >= 7) {
                break;
            }
        }

        this.ClearLeftovers();
        this.FinishSignal.Fire();
    }
}
