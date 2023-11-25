import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { INight } from "./INight";
import { SpawnComponent } from "../components/SpawnComponent";
import { Workspace } from "@rbxts/services";

const components = Dependency<Components>();

const HARDNESS = 1;

@Component({})
export class FirstNight implements OnStart, INight {
    private Spawns: SpawnComponent[] = [];

    onStart() {}

    private SetSpawns() {
        if (Workspace.FindFirstChild("Map")?.FindFirstChild("AlternativeSpawn") === undefined) return;

        Workspace.Map.AlternativeSpawn.GetChildren().forEach((spawn) => {
            const spawnComponent = components.addComponent<SpawnComponent>(spawn);
            spawnComponent.GameStart(1);
            this.Spawns.push(spawnComponent);
        });
    }

    public StartNight() {
        this.SetSpawns();

        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(math.random(5 / HARDNESS, 10 / HARDNESS))) {
            const emptySpawn = math.random(0, 2);

            for (let index = 0; index < this.Spawns.size(); index++) {
                if (index === emptySpawn) {
                    this.Spawns[index].Hide();
                    continue;
                }
                this.Spawns[index].Show();
            }
        }
    }
}
