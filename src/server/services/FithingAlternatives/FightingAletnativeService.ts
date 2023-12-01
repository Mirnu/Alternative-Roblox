import { Service, OnStart, OnInit } from "@flamework/core";
import { IFigthing } from "./modules/IFighting";
import { ViewAlternatives } from "./modules/ViewAlternatives";
import { FlashLight } from "./modules/FlashLight";
import { PlayerService } from "../PlayerService";
import { Components } from "@flamework/components";
import { PlayerComponent } from "server/components/PlayerComponent";
import { PLayerStateData } from "types/Replica";
import { SessionStatus } from "shared/types/SessionStatus";

const TypesFightings = new Map<number, Array<IFigthing>>([
    [1, [new ViewAlternatives()]],
    [2, [new FlashLight()]],
]);

@Service({})
export class FightingAletnativeService implements OnStart {
    constructor(private components: Components, private playerService: PlayerService) {}
    onStart() {
        this.playerService.PlayerAddedSignal.Connect((player) => this.PlayerAdded(player));
    }

    private currentTypeFightings?: thread[];

    private stopCurrentTypeFightings() {
        this.currentTypeFightings?.forEach((thread) => task.cancel(thread));
    }

    private PlayerStateChanged(data: PLayerStateData) {
        this.stopCurrentTypeFightings();
        const thread = task.spawn(() => {
            TypesFightings.get(data.Static.Night)?.forEach((element) => element.Start());
        });
        this.currentTypeFightings?.push(thread);
    }

    private PlayerAdded(player: Player) {
        const playerComponent = this.components.getComponent<PlayerComponent>(player);
        if (playerComponent === undefined) return;
        this.PlayerStateChanged(playerComponent.PlayerStateReplica!.Data);
        playerComponent.SessionStatusChangedSignal.Connect((data) => {
            if (data.Static.SessionStatus === SessionStatus.Playing) this.PlayerStateChanged(data);
            else if (data.Static.SessionStatus === SessionStatus.Menu) this.stopCurrentTypeFightings();
        });
    }
}
