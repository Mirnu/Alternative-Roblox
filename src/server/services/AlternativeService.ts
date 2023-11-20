import { Components } from "@flamework/components";
import { Service, OnStart } from "@flamework/core";
import { PlayerComponent } from "server/components/PlayerComponent";
import { Events } from "server/network";
import { AlternativeComponent } from "server/components/Alternatives/AlternativeComponent";

const regen = 0.5;

@Service()
export class AlternativeService implements OnStart {
    constructor(private components: Components) {}

    private getAlternativeComponents(object: Instance) {
        const alternativeComponents = this.components.getComponents(object, AlternativeComponent);

        return alternativeComponents[0];
    }

    onStart() {
        this.Init();
    }

    private Init() {
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
        const PlayerComponent = this.components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.TakeMentalDamage(damage);
    }

    private EyeClose(player: Player) {
        const PlayerComponent = this.components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.EyeOpened = false;
    }

    private EyeOpened(player: Player) {
        const PlayerComponent = this.components.getComponent<PlayerComponent>(player)!;
        PlayerComponent.EyeOpened = true;
    }
}
