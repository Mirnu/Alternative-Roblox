import { SpawnComponent } from "server/components/SpawnComponent";
import { Workspace } from "@rbxts/services";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";

const components = Dependency<Components>();

const HARDNESS = 1;

export class SecondNight {
    private Spawns: SpawnComponent[] = [];

    private SetSpawns() {
        if (Workspace.FindFirstChild("Map")?.FindFirstChild("AlternativeSpawn") === undefined) return;

        Workspace.Map.AlternativeSpawn.GetChildren().forEach((spawn) => {
            const spawnComponent = components.addComponent<SpawnComponent>(spawn);
            spawnComponent.GameStart(2);
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
