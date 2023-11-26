import { Components } from "@flamework/components";
import { Service, OnStart, Dependency } from "@flamework/core";
import { AlternativeComponent } from "server/components/Alternatives/AlternativeComponent";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";
import { IFigthing } from "./IFighting";

const regen = 0.5;

const components = Dependency<Components>();

@Service()
export class ViewAlternatives implements IFigthing {
    private getAlternativeComponents(object: Instance) {
        const alternativeComponents = components.getComponents(object, AlternativeComponent);

        return alternativeComponents[0];
    }

    public Start(): void {
        Events.RayProcces.connect((player, object) => {
            if (object) {
                const alternativeComponent = this.getAlternativeComponents(object);
                if (alternativeComponent !== undefined && alternativeComponent.damage) {
                    this.AlternativeDetection(player, alternativeComponent.damage);
                }
                return;
            }

            this.AlternativeDetection(player, regen);
        });

        Events.EyeClosed.connect((player) => this.EyeClose(player));
        Events.EyeOpened.connect((player) => this.EyeOpened(player));
    }

    private AlternativeDetection(player: Player, damage: number) {
        const PlayerComponent = components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.GameStateReplica?.SetValue(
            "Mental",
            math.clamp(PlayerComponent.GameStateReplica.Data.Mental + damage, 0, 100),
        );
    }

    private EyeClose(player: Player) {
        const PlayerComponent = components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.EyeOpened = false;
    }

    private EyeOpened(player: Player) {
        const PlayerComponent = components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.EyeOpened = true;
    }
}
