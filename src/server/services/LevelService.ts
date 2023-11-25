import { Components } from "@flamework/components";
import { Service, OnStart, OnInit } from "@flamework/core";
import Signal from "@rbxts/signal";
import { Events } from "server/network";
import { PlayerService } from "./PlayerService";
import { PlayerComponent } from "server/components/PlayerComponent";
import { INight } from "server/classes/INight";
import { FirstNight } from "server/classes/FirstNight";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

const Nights = new ReadonlyMap<number, INight>([[1, new FirstNight()]]);

@Service({})
export class LevelService implements OnStart {
    constructor(private components: Components) {}

    public GameStarted = new Signal<(level: number) => void>();

    private GetPlayerComponent(player?: Player): PlayerComponent | undefined {
        if (player === undefined) return;
        return this.components.getComponent<PlayerComponent>(player);
    }

    private LevelReadiness(level?: number, playerComponent?: PlayerComponent) {
        if (Workspace.FindFirstChild("Map")) Workspace.Map.Destroy();
        if (
            ReplicatedStorage.Prefabs.Maps.FindFirstChild(tostring(level)) === undefined ||
            playerComponent === undefined
        )
            return;
        return true;
    }

    private NewLevel(player: Player) {
        const playerComponent = this.GetPlayerComponent(player);
        if (this.LevelReadiness(1, playerComponent) === undefined) return;

        const map = ReplicatedStorage.Prefabs.Maps.WaitForChild("1").WaitForChild("Map").Clone();
        map.Parent = Workspace;
        playerComponent?.SetNight(1);
        playerComponent!.StartNight();

        this.GameStarted.Fire(1);
        this.StartNight(1);
    }

    private ContinueLevel(player: Player) {
        const playerComponent = this.GetPlayerComponent(player);
        if (this.LevelReadiness(playerComponent?.GetNight(), playerComponent) === undefined) return;

        const map = ReplicatedStorage.Prefabs.Maps.WaitForChild(playerComponent!.GetNight())
            .WaitForChild("Map")
            .Clone();
        map.Parent = Workspace;
        const night = playerComponent!.StartNight();

        this.GameStarted.Fire(night);
        this.StartNight(night);
    }

    private StartNight(level: number) {
        const night = Nights.get(level);
        night?.StartNight();
    }

    onStart() {
        Events.NewGame.connect((player) => this.NewLevel(player));
        Events.ContinueGame.connect((player) => this.ContinueLevel(player));
    }
}
