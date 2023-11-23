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
    constructor(private components: Components, private playerService: PlayerService) {}

    private player?: Player;
    public GameStarted = new Signal<(level: number) => void>();

    private NewLevel() {
        if (this.player === undefined) return 0;
        const playerComponent = this.components.getComponent<PlayerComponent>(this.player);
        if (playerComponent === undefined) return 0;

        if (Workspace.FindFirstChild("Map")) Workspace.Map.Destroy();

        const map = ReplicatedStorage.Prefabs.Maps.WaitForChild(playerComponent.GetNight()).WaitForChild("Map").Clone();
        map.Parent = Workspace;

        const night = playerComponent.StartNight();

        this.GameStarted.Fire(night);
        this.StartNight(night);
        return night;
    }

    private StartNight(level: number) {
        const night = Nights.get(level);
        night?.StartNight();
    }

    onStart() {
        Events.GameStarted.connect(() => this.NewLevel());

        this.playerService.PlayerAddedSignal.Connect((player) => {
            this.player = player;
        });
    }
}
