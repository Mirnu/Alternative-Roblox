import { Components } from "@flamework/components";
import { Service, OnStart, OnInit } from "@flamework/core";
import Signal from "@rbxts/signal";
import { Events } from "server/network";
import { PlayerComponent } from "server/components/PlayerComponent";
import { INight } from "server/classes/INight";
import { FirstNight } from "server/classes/FirstNight";
import { Lighting, ReplicatedStorage, Workspace } from "@rbxts/services";
import { NightService } from "./NightService";
import { SpawnComponent } from "server/components/SpawnComponent";
import { PlayerService } from "./PlayerService";
import { SecondNight } from "server/classes/SecondNights";

const Nights = new ReadonlyMap<number, INight>([
    [1, new FirstNight()],
    [2, new SecondNight()],
]);

const TIME_DELAY = 0.1;
const TIME_DELTA = 0.002 * 10;

@Service({})
export class LevelService implements OnStart {
    constructor(
        private components: Components,
        private nightService: NightService,
        private playerService: PlayerService,
    ) {}

    private ThreadNightCycle?: thread;
    public FinishSignal = new Signal();
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
        this.nightService.SetNight(player, 1);
        this.nightService.StartNight(player);

        this.GameStarted.Fire(1);
        this.StartNight(1);
    }

    private ContinueLevel(player: Player) {
        const playerComponent = this.GetPlayerComponent(player);
        if (this.LevelReadiness(this.nightService.GetNight(player), playerComponent) === undefined) return;

        const map = ReplicatedStorage.Prefabs.Maps.WaitForChild(this.nightService.GetNight(player))
            .WaitForChild("Map")
            .Clone();
        map.Parent = Workspace;
        const night = this.nightService.StartNight(player);

        this.GameStarted.Fire(night);
        this.StartNight(night);
    }

    private StartNight(level: number) {
        const night = Nights.get(level);
        task.spawn(() => night?.StartNight());

        if (this.ThreadNightCycle) task.cancel(this.ThreadNightCycle);
        this.ThreadNightCycle = task.spawn(() => this.StartNightCycle());
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

    onStart() {
        Events.NewGame.connect((player) => this.NewLevel(player));
        Events.ContinueGame.connect((player) => this.ContinueLevel(player));
        this.PlayerAdded();
    }

    private PlayerAdded() {
        this.playerService.PlayerAddedSignal.Connect((player) => {
            this.nightService.Init(player);
            this.FinishSignal.Connect(() => this.nightService.NightOver(player, 1));
            Events.GameInited.fire(player, this.nightService.GetNight(player));

            const playerComponent = this.GetPlayerComponent(player);
            if (playerComponent === undefined) return;
            playerComponent.MentalChanged.Connect((mental) => {
                if (mental !== undefined && mental <= 0) {
                    this.nightService.NightOver(player, 0);
                    task.cancel(this.ThreadNightCycle!);
                    Lighting.ClockTime = 12;
                }
            });
        });
    }
}
