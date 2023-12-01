import { Components } from "@flamework/components";
import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";
import Signal from "@rbxts/signal";
import { NightService } from "./NightService";

@Service({})
export class PlayerService implements OnStart {
    constructor(private components: Components, private nightService: NightService) {}

    public PlayerAddedSignal = new Signal<(player: Player) => void>();

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            this.PlayerInit(player);
            this.PlayerAddedSignal.Fire(player);
        });
    }

    private PlayerInit(player: Player) {
        const playerComponent = this.components.addComponent<PlayerComponent>(player);
        Events.GameInited.fire(player, playerComponent.PlayerStateReplica!.Data.Static.Night);
    }
}
