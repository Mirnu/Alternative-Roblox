import { Components } from "@flamework/components";
import { Service, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";
import { LevelService } from "./LevelService";
import { INight } from "server/classes/INight";
import { FirstNight } from "server/classes/FirstNight";

const Nights = new ReadonlyMap<number, INight>([[1, new FirstNight()]]);

@Service({})
export class PlayerService implements OnStart {
    constructor(private components: Components, private levelService: LevelService) {}

    onStart() {
        Players.PlayerAdded.Connect((player) => {
            this.PlayerInit(player);
        });

        this.levelService.GameStarted.Connect((level: number) => {
            const night = Nights.get(level);
            night?.StartNight();
        });
    }

    private PlayerInit(player: Player) {
        this.components.addComponent<PlayerComponent>(player);
        Events.GameInited.fire(player);
    }
}
