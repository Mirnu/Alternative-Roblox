import { Component } from "@flamework/components";
import { AlternativeComponent } from "./AlternativeComponent";
import { ReplicatedStorage } from "@rbxts/services";

const damage = -1;

type soundNumber = 1 | 2;

@Component()
export class Alternative2 extends AlternativeComponent {
    constructor() {
        super();
        this.damage = damage;
    }

    public PlaySound() {
        const number = math.random(1, 2) as soundNumber;
        const sound = ReplicatedStorage.Prefabs.Sound.Nights["2"][number].Clone();
        sound.Parent = this.instance;
        sound.Play();
    }
}
