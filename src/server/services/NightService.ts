import { Service, OnStart, OnInit } from "@flamework/core";
import { Components } from "@flamework/components";
import { PlayerComponent } from "server/components/PlayerComponent";
import { SessionStatus } from "shared/types/SessionStatus";
import { Events } from "server/network";

@Service({})
export class NightService implements OnStart {
    constructor(private components: Components) {}

    onStart() {}

    public Init(player: Player) {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined) return;
    }

    public StartNight(player: Player): number {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined || playerComponent.PlayerStateReplica?.Data.Night === undefined) return -1;
        playerComponent.PlayerStateReplica.SetValue("SessionStatus", SessionStatus.Playing);

        return playerComponent.PlayerStateReplica.Data.Night;
    }

    public GetNight(player: Player): number {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined || playerComponent.PlayerStateReplica?.Data.Night === undefined) return 1;
        return playerComponent.PlayerStateReplica.Data.Night;
    }

    public SetNight(player: Player, night: number) {
        const playerReplica = this.components.getComponent<PlayerComponent>(player)?.PlayerStateReplica;

        if (playerReplica) playerReplica.SetValue("Night", night);
    }

    public NightOver(player: Player, night: number) {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined) return;

        playerComponent.EyeOpened = true;
        playerComponent.GameStateReplica?.SetValue("Mental", 100);
        playerComponent.PlayerStateReplica?.SetValue("SessionStatus", SessionStatus.Menu);
        playerComponent.PlayerStateReplica?.SetValue("Night", this.GetNight(player) + night);
        playerComponent.PlayerStateChanged.Fire(playerComponent.PlayerStateReplica!.Data);
        Events.GameInited.fire(player, this.GetNight(player));
    }
}
