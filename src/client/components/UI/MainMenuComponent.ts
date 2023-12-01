import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenService } from "@rbxts/services";
import { Events } from "client/network";
import Signal from "@rbxts/signal";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { PlayerDataReplica } from "types/Replica";
import { SessionStatus } from "shared/types/SessionStatus";

interface Attributes {}

@Component({})
export class MainMenuComponent extends BaseComponent<Attributes, PlayerGui["MainMenu"]> implements OnStart {
    private MainMenuTexts = this.instance["Texts"];
    private Continue = this.MainMenuTexts["0"];
    private NewGame = this.MainMenuTexts["1"];
    private Options = this.MainMenuTexts["2"];
    private Credits = this.MainMenuTexts["3"];
    private Exit = this.MainMenuTexts["4"];

    public static readonly GameStarted = new Signal<(level: number) => void>();

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

    private ResetAllButtons() {
        this.MainMenuTexts.GetChildren().forEach((imageLabel) => {
            const ImageLabel = imageLabel as never as PlayerGui["MainMenu"]["Texts"]["1"];
            ImageLabel.ImageTransparency = 1;
        });
    }

    @OnReplicaCreated()
    private InitHandlerSessionStatus(replica: PlayerDataReplica) {
        replica.ListenToChange("Static.SessionStatus", (newValue) => {
            if (newValue === SessionStatus.Playing) {
                this.instance.Enabled = false;
            } else if (newValue === SessionStatus.Menu) {
                this.instance.Enabled = true;
            }
        });
    }

    private InitActivation() {
        this.NewGame.text.Activated.Connect(() => Events.NewGame.fire());
        this.Continue.text.Activated.Connect(() => Events.ContinueGame.fire());

        this.MainMenuTexts.GetChildren().forEach((imageLabel) => {
            const ImageLabel = imageLabel as never as PlayerGui["MainMenu"]["Texts"]["1"];
            ImageLabel.text.Activated.Connect(() => this.ResetAllButtons());
        });
    }

    private InitTextLabels(night: number) {
        if (night > 1) {
            this.Continue.Visible = true;
            this.Continue.text.Text = `Continue ${night} night`;
        } else {
            this.Continue.Visible = false;
        }
    }

    onStart() {
        this.instance.Enabled = true;
        this.InitMouseMoveOperation();
        this.InitActivation();

        Events.GameInited.connect((night) => this.InitTextLabels(night));
    }
}
