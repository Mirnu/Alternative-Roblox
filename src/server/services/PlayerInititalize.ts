import { Components } from "@flamework/components";
import { Service, OnStart, Dependency } from "@flamework/core";
import { Players } from "@rbxts/services";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";

@Service()
export class PlayerInititalize implements OnStart {
    constructor(private components: Components) {}

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            this.PlayerInit(player);
        });
    }

    private PlayerInit(player: Player) {
        this.components.addComponent<PlayerComponent>(player);
        Events.GameInited.fire(player);
    }
}
