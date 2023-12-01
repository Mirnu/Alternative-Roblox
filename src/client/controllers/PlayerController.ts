import { Controller, OnStart } from "@flamework/core";
import { ReplicaController } from "@rbxts/replicaservice";
import Signal from "@rbxts/signal";
import { PLayerStateData, PlayerDataReplica } from "types/Replica";

@Controller({
    loadOrder: 0,
})
export class PlayerController implements OnStart {
    public LastPlayerData?: PLayerStateData;
    public PlayerData!: PLayerStateData;
    private replica!: PlayerDataReplica;
    private waitingForReplica?: Signal;

    public GetReplicaAsync() {
        if (this.replica) return this.replica;
        if (!this.waitingForReplica) {
            this.waitingForReplica = new Signal();
        }
        this.waitingForReplica.Wait();
        return this.replica;
    }

    private initReplicaCreated() {
        ReplicaController.ReplicaOfClassCreated("PlayerState", (replica) => {
            this.replica = replica;
            this.waitingForReplica?.Fire();
            this.waitingForReplica?.Destroy();
        });
    }

    onStart() {
        this.initReplicaCreated();
        ReplicaController.RequestData();
    }
}
