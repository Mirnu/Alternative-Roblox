import { Controller, OnStart, OnInit } from "@flamework/core";
import { ReplicaController } from "@rbxts/replicaservice";
import { Lighting, TweenService } from "@rbxts/services";
import { EyeComponents } from "client/components/UI/EyeComponents";

@Controller({})
export class MentalController implements OnStart {
    private ColorCorrection = Lighting.WaitForChild("ColorCorrection") as ColorCorrectionEffect;
    private currentTween?: Tween;

    onStart() {
        this.ReplicaMental();
    }

    private ReplicaMental() {
        ReplicaController.ReplicaOfClassCreated("Mental", (replica) => {
            replica.ListenToChange(["Mental"], (newValue) => {
                this.MentalChanged(newValue);
            });
        });
    }

    private StartCurrentActions(goalColor: Color3) {
        if (this.currentTween) this.currentTween.Cancel();

        this.currentTween = TweenService.Create(this.ColorCorrection, new TweenInfo(0.1), { TintColor: goalColor });
        this.currentTween.Play();
    }

    private MentalChanged(mental: number) {
        const goalColor = new Color3(this.ColorCorrection.TintColor.R, mental / 100, mental / 100);

        EyeComponents.GetInstance()?.SetColor(1 - mental / 100);
        this.StartCurrentActions(goalColor);
    }
}
