import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Replica, ReplicaService } from "@rbxts/replicaservice";
import { NightService } from "server/services/NightService";
import { SessionStatus } from "shared/types/SessionStatus";
import Signal from "@rbxts/signal";
import { PLayerData } from "types/Replica";

interface Attributes {}

const EyeDamage = -0.2;
const GameclassToken = ReplicaService.NewClassToken("GameState");
const PlayerclassToken = ReplicaService.NewClassToken("PlayerState");

@Component({})
export class PlayerComponent extends BaseComponent<Attributes, Player> implements OnStart {
    constructor(private nightService: NightService) {
        super();
    }

    public GameStateReplica?: Replica<"GameState">;
    public PlayerStateReplica?: Replica<"PlayerState">;
    public EyeOpened = true;

    public MentalChanged = new Signal<(mental: number) => void>();
    public PlayerStateChanged = new Signal<(data: PLayerData) => void>();

    onStart() {
        this.initGameState();
        this.initPlayerState();
        this.PlayerStateChanged.Fire(this.PlayerStateReplica!.Data);
    }

    private initGameState() {
        this.GameStateReplica = ReplicaService.NewReplica({
            ClassToken: GameclassToken,
            Data: {
                Mental: 100,
                FlashLight: 100,
            },
            Replication: this.instance,
        });
    }

    private initPlayerState() {
        this.PlayerStateReplica = ReplicaService.NewReplica({
            ClassToken: PlayerclassToken,
            Data: {
                Night: 1,
                SessionStatus: SessionStatus.Menu,
            },
            Replication: this.instance,
        });
    }
}
