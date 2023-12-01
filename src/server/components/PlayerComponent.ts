import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Replica, ReplicaService } from "@rbxts/replicaservice";
import { NightService } from "server/services/NightService";
import { SessionStatus } from "shared/types/SessionStatus";
import Signal from "@rbxts/signal";
import { PLayerStateData } from "types/Replica";

interface Attributes {}

const PlayerclassToken = ReplicaService.NewClassToken("PlayerState");

@Component({})
export class PlayerComponent extends BaseComponent<Attributes, Player> implements OnStart {
    public PlayerStateReplica?: Replica<"PlayerState">;
    public PlayerStateChanged = new Signal<(data: PLayerStateData) => void>();
    public SessionStatusChangedSignal = new Signal<(data: PLayerStateData) => void>();

    onStart() {
        this.initPlayerState();
        this.PlayerStateChanged.Fire(this.PlayerStateReplica!.Data);
    }

    private playerStateChange() {
        if (this.PlayerStateReplica?.Data) this.PlayerStateChanged.Fire(this.PlayerStateReplica?.Data);
    }

    private initPlayerState() {
        this.PlayerStateReplica = ReplicaService.NewReplica({
            ClassToken: PlayerclassToken,
            Data: {
                Static: {
                    Night: 2,
                    SessionStatus: SessionStatus.Menu,
                },
                Dynamic: {
                    EyeOpened: true,
                    Mental: 100,
                    FlashLight: 100,
                },
            },
            Replication: this.instance,
        });
    }

    public StartNight(): number {
        if (this.PlayerStateReplica?.Data.Static.Night === undefined) return -1;
        this.PlayerStateReplica.SetValue("Static.SessionStatus", SessionStatus.Playing);
        this.playerStateChange();
        return this.PlayerStateReplica!.Data.Static.Night;
    }

    public SetNight(night: number) {
        this.PlayerStateReplica?.SetValue("Static.Night", night);
        this.playerStateChange();
    }

    public SetMental(mental: number) {
        this.PlayerStateReplica?.SetValue("Dynamic.Mental", math.clamp(mental, 0, 100));
        this.playerStateChange();
    }

    public SetSessionStatus(sessionStatus: SessionStatus) {
        this.PlayerStateReplica?.SetValue("Static.SessionStatus", sessionStatus);
        this.SessionStatusChangedSignal.Fire(this.PlayerStateReplica!.Data);
    }

    public SetEyeState(state: boolean) {
        this.PlayerStateReplica?.SetValue("Dynamic.EyeOpened", state);
        this.playerStateChange();
    }

    public SetFlashLight(value: number) {
        this.PlayerStateReplica?.SetValue("Dynamic.FlashLight", math.max(value, 0));
        this.playerStateChange();
    }
}
