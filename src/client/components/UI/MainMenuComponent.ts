import { OnInit, OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenService } from "@rbxts/services";
import { Functions } from "client/network";
import Signal from "@rbxts/signal";

interface Attributes {}

@Component({})
export class MainMenuComponent extends BaseComponent<Attributes, PlayerGui["MainMenu"]> implements OnStart {
    private MainMenuTexts = this.instance["Texts"];
    private NewGame = this.MainMenuTexts["1"];
    private Options = this.MainMenuTexts["2"];
    private Credits = this.MainMenuTexts["3"];
    private Exit = this.MainMenuTexts["4"];

    public static readonly GameStarted = new Signal();

    private currentTween?: Tween;

    private SetBGAlpha(instance: ImageLabel, alpha: number) {
        this.currentTween = TweenService.Create(instance, new TweenInfo(0.25), { ImageTransparency: alpha });
        this.currentTween.Play();
    }

    private InitMouseMoveOperation() {
        this.MainMenuTexts.GetChildren().forEach((imageLabel) => {
            const ImageLabel = imageLabel as never as PlayerGui["MainMenu"]["Texts"]["1"];
            ImageLabel.text.MouseEnter.Connect(() => this.SetBGAlpha(ImageLabel, 0));
            ImageLabel.text.MouseLeave.Connect(() => this.SetBGAlpha(ImageLabel, 1));
        });
    }

    private InitActivation() {
        this.NewGame.text.Activated.Connect(async () => {
            const started = await Functions.GameStarted.invoke();

            if (started) {
                MainMenuComponent.GameStarted.Fire();
                this.instance.Enabled = false;
            }
        });
    }

    onStart() {
        this.instance.Enabled = true;
        this.InitMouseMoveOperation();
        this.InitActivation();
    }
}
