import { Events } from "server/network";
import { IFigthing } from "./IFighting";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { PlayerComponent } from "server/components/PlayerComponent";

const components = Dependency<Components>();

export class FlashLight implements IFigthing {
    private flashLightThread?: thread;

    private FlashEnable(player: Player) {
        const playerComponent = components.getComponent<PlayerComponent>(player)!;
        this.flashLightThread = task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.1)) {
                playerComponent.GameStateReplica?.SetValue(
                    "FlashLight",
                    math.max(playerComponent.GameStateReplica?.Data.FlashLight - 0.05, 0),
                );
            }
        });
    }

    private FlashDisable(player: Player) {
        if (this.flashLightThread) task.cancel(this.flashLightThread);
    }

    Start(): void {
        Events.FlashLightEnable.connect((player) => this.FlashEnable(player));
        Events.FlashLightDisable.connect((player) => this.FlashDisable(player));
    }
}
