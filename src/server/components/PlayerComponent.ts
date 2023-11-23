import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Replica, ReplicaService } from "@rbxts/replicaservice";
import { DayService } from "server/services/NightService";
import { SessionStatus } from "shared/types/SessionStatus";
import { Events } from "server/network";
import { Character } from "types/Character";

interface Attributes {}

const EyeDamage = -0.2;
const GameclassToken = ReplicaService.NewClassToken("GameState");
const PlayerclassToken = ReplicaService.NewClassToken("PlayerState");

@Component({})
export class PlayerComponent extends BaseComponent<Attributes, Player> implements OnStart {
    constructor(private dayService: DayService) {
        super();
    }

    private GameStateReplica?: Replica<"GameState">;
    private PlayerStateReplica?: Replica<"PlayerState">;
    public EyeOpened = true;

    onStart() {
        this.initGameState();
        this.initPlayerState();

        this.dayService.FinishSignal.Connect(() => this.NightOver());
    }

    private initGameState() {
        this.GameStateReplica = ReplicaService.NewReplica({
            ClassToken: GameclassToken,
            Data: {
                Mental: 100,
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

    public TakeMentalDamage(damage: number) {
        if (!this.EyeOpened) {
            damage = EyeDamage;
        }

        this.GameStateReplica?.SetValue("Mental", math.clamp(this.GameStateReplica.Data.Mental + damage, 0, 100));

        if (this.GameStateReplica?.Data.Mental !== undefined && this.GameStateReplica?.Data.Mental <= 0) {
            this.PlayerStateReplica?.SetValue("SessionStatus", SessionStatus.Menu);
            this.TakeMentalDamage(100);
        }
    }

    public StartNight(): number {
        if (this.PlayerStateReplica?.Data.Night === undefined) return -1;
        this.PlayerStateReplica?.SetValue("SessionStatus", SessionStatus.Playing);

        return this.PlayerStateReplica?.Data.Night;
    }

    public GetNight(): number {
        if (this.PlayerStateReplica === undefined) return 1;
        return this.PlayerStateReplica.Data.Night;
    }

    private NightOver() {
        this.PlayerStateReplica?.SetValue("Night", this.GetNight() + 1);
        Events.GameInited.fire(this.instance, this.GetNight());
        this.PlayerStateReplica?.SetValue("SessionStatus", SessionStatus.Menu);
    }
}
