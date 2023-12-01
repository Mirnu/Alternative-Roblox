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

    private getOccupiedSpawns(): number[] {
        const spawns: number[] = [];
        let constAlternatives = 0;

        while (constAlternatives !== 3) {
            const randNum = math.random(0, 7);
            if (spawns.indexOf(randNum) === -1) spawns.insert(randNum, randNum);
            constAlternatives++;
        }
        return spawns;
    }

    public StartNight() {
        this.SetSpawns();
        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(math.random(5 / HARDNESS, 10 / HARDNESS))) {
            const occupiedSpawns = this.getOccupiedSpawns();
            for (let index = 0; index < this.Spawns.size(); index++) {
                if (occupiedSpawns[index] !== undefined) {
                    this.Spawns[index].Show();
                    continue;
                }
                this.Spawns[index].Hide();
            }
        }
    }
}
