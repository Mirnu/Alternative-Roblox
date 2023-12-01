import { Controller, OnStart, OnInit } from "@flamework/core";
import { Lighting, TweenService } from "@rbxts/services";
import { EyeComponents } from "client/components/UI/EyeComponents";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { PlayerDataReplica } from "types/Replica";

@Controller({})
export class MentalController implements OnStart {
    private ColorCorrection = Lighting.WaitForChild("ColorCorrection") as ColorCorrectionEffect;
    private currentTween?: Tween;

    onStart() {}

    private StartCurrentActions(goalColor: Color3) {
        if (this.currentTween) this.currentTween.Cancel();
        this.currentTween = TweenService.Create(this.ColorCorrection, new TweenInfo(0.1), { TintColor: goalColor });
        this.currentTween.Play();
    }

    @OnReplicaCreated()
    private initReplica(replica: PlayerDataReplica) {
        replica.ListenToChange("Dynamic.Mental", (newMental) => {
            const goalColor = new Color3(this.ColorCorrection.TintColor.R, newMental / 100, newMental / 100);

            EyeComponents.GetInstance()?.SetColor(1 - newMental / 100);
            this.StartCurrentActions(goalColor);
        });
    }
}
