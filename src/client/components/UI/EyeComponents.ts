import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { TweenService, UserInputService } from "@rbxts/services";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { PLayerStateData, PlayerDataReplica } from "types/Replica";
import { SessionStatus } from "shared/types/SessionStatus";
import { Events } from "client/network";

@Component({})
export class EyeComponents extends BaseComponent<{}, PlayerGui["PlayerGui"]["Eyes"]> implements OnStart {
    private static instance?: EyeComponents;
    private stateEye = 0;
    private canClose = false;
    private currentTweens: Array<Tween> = new Array<Tween>();
    private closeEyesThread?: thread;

    onStart() {
        EyeComponents.instance = this;

        UserInputService.InputBegan.Connect((input) => {
            if (input.KeyCode === Enum.KeyCode.Space) this.CloseEyes();
        });
        UserInputService.InputEnded.Connect((input) => {
            if (input.KeyCode === Enum.KeyCode.Space) this.OpenEyes();
        });
    }

    public static GetInstance() {
        return this.instance;
    }

    @OnReplicaCreated()
    public Init(replica: PlayerDataReplica) {
        replica.ListenToChange("Static.SessionStatus", (newValue) => {
            if (newValue === SessionStatus.Menu || replica.Data.Static.Night > 1) {
                this.canClose = false;
                this.instance.down.Position = UDim2.fromScale(0, 0.467);
                this.instance.up.Position = UDim2.fromScale(0, -0.501);
            } else if (newValue === SessionStatus.Playing) {
                this.canClose = true;
            }
        });
    }
    public CloseEyes() {
        if (this.closeEyesThread) task.cancel(this.closeEyesThread);
        this.closeEyesThread = task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.005)) {
                if (!this.canClose) return;
                const res: Boolean = this.Close();

                this.stateEye = math.clamp(this.stateEye + 0.01, 0, 1);
                if (this.stateEye > 0.8) Events.EyeClosed.fire();

                if (!res) {
                    break;
                }
                print(1);
            }
        });
    }

    public OpenEyes() {
        if (this.closeEyesThread) task.cancel(this.closeEyesThread);
        this.closeEyesThread = task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.005)) {
                if (!this.canClose) return;
                const res: Boolean = this.Open();

                this.stateEye = math.clamp(this.stateEye - 0.01, 0, 1);
                if (this.stateEye < 0.8) Events.EyeOpened.fire();

                if (!res) {
                    break;
                }
            }
        });
    }

    private Open() {
        if (this.instance.down.Position.Y.Scale > 0.46) {
            return false;
        }

        this.instance.down.Position = this.instance.down.Position.add(UDim2.fromScale(0, 0.01));
        this.instance.up.Position = this.instance.up.Position.sub(UDim2.fromScale(0, 0.01));

        return true;
    }

    private Close() {
        if (this.instance.down.Position.Y.Scale < -0.53) {
            return false;
        }

        this.instance.down.Position = this.instance.down.Position.sub(UDim2.fromScale(0, 0.01));
        this.instance.up.Position = this.instance.up.Position.add(UDim2.fromScale(0, 0.01));

        return true;
    }

    private StopCurrenttweens() {
        if (!this.currentTweens.isEmpty()) {
            this.currentTweens.forEach((tween) => {
                tween.Cancel();
            });
        }
    }

    private ActivateCurrentTweens() {
        this.currentTweens.forEach((tween) => tween.Play());
    }

    public SetColor(red: number) {
        this.StopCurrenttweens();

        const t1 = TweenService.Create(this.instance.up, new TweenInfo(0.1), { ImageColor3: new Color3(red, 0, 0) });
        const t2 = TweenService.Create(this.instance.down, new TweenInfo(0.1), { ImageColor3: new Color3(red, 0, 0) });
        const t3 = TweenService.Create(this.instance.down.Frame, new TweenInfo(0.1), {
            BackgroundColor3: new Color3(red, 0, 0),
        });
        const t4 = TweenService.Create(this.instance.up.Frame, new TweenInfo(0.1), {
            BackgroundColor3: new Color3(red, 0, 0),
        });

        this.currentTweens.push(t1, t2, t3, t4);

        this.ActivateCurrentTweens();
    }
}
