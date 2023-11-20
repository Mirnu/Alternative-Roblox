import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Replica, ReplicaService } from "@rbxts/replicaservice";

interface Attributes {}

const EyeDamage = -0.2;
const classToken = ReplicaService.NewClassToken("Mental");

@Component({})
export class PlayerComponent extends BaseComponent<Attributes, Player> implements OnStart {
    private MentalReplica?: Replica<"Mental">;
    public EyeOpened = true;

    onStart() {
        this.MentalReplica = ReplicaService.NewReplica({
            ClassToken: classToken,
            Data: {
                Mental: 100,
            },
            Replication: this.instance,
        });
    }

    public TakeMentalDamage(damage: number) {
        if (!this.EyeOpened) {
            damage = EyeDamage;
        }

        this.MentalReplica?.SetValue("Mental", math.clamp(this.MentalReplica.Data.Mental + damage, 0, 100));
    }
}
