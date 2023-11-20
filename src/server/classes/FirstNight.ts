import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { INight } from "./INight";
import { SpawnComponent } from "../components/SpawnComponent";

const components = Dependency<Components>();

@Component({})
export class FirstNight implements OnStart, INight {
    private AllSpawns: SpawnComponent[] = [];

    onStart() {}

    private SetAllSpawns() {
        const SpawnComponents = components.getAllComponents<SpawnComponent>();

        SpawnComponents.forEach((spawnComponent) => {
            if (spawnComponent) this.AllSpawns.push(spawnComponent);
        });
    }

    public StartNight() {
        this.SetAllSpawns();

        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(math.random(5, 10))) {
            const emptySpawn = math.random(0, 2);

            for (let index = 0; index < this.AllSpawns.size(); index++) {
                if (index === emptySpawn) {
                    this.AllSpawns[index].Hide();
                    continue;
                }
                this.AllSpawns[index].Show();
            }
        }
    }
}
