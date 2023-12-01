import { Service, OnStart, OnInit } from "@flamework/core";
import { Components } from "@flamework/components";
import { PlayerComponent } from "server/components/PlayerComponent";
import { SessionStatus } from "shared/types/SessionStatus";
import { Events } from "server/network";

@Service({})
export class NightService implements OnStart {
    constructor(private components: Components) {}

    onStart() {}

    public FinishNight(player: Player, night: number) {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined) return;

        playerComponent.SetEyeState(true);
        playerComponent.SetMental(100);
        playerComponent.SetSessionStatus(SessionStatus.Menu);
        playerComponent.SetNight(playerComponent.PlayerStateReplica!.Data.Static.Night + night);
        Events.GameInited.fire(player, playerComponent.PlayerStateReplica!.Data.Static.Night);
    }
}
