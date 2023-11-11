import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service()
export class PlayerInitialize implements OnStart{
    PlayerAdded(player: Player) {
        
    }

    onStart(): void {
        Players.PlayerAdded.Connect((player: Player) => {
            print("Hello world");
        });
    }

}