import { Controller, OnStart, OnInit, Dependency } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { LocalPlayer } from "client/LocalPlayer";
import { MainMenuComponent } from "client/components/UI/MainMenuComponent";

const regen = 0.5;

@Controller({})
export class CameraController implements OnStart, OnInit {
    private camera: Camera | undefined = Workspace.CurrentCamera;
    private baseCameraPos = Workspace.WaitForChild("Map").WaitForChild("CamStarterPoint") as BasePart;
    private mouse: PlayerMouse = LocalPlayer.GetMouse();

    private sensitivity: number = 2;

    private rightBorder!: number;
    private leftBorder!: number;

    public GameInited = false;

    onInit() {
        if (this.camera !== undefined) {
            this.rightBorder = this.camera.ViewportSize.X - this.camera.ViewportSize.X / 8;
            this.leftBorder = this.camera.ViewportSize.X / 8;
            this.camera.CameraType = Enum.CameraType.Scriptable;
        }
    }

    onStart() {
        task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.01)) {
                this.Move(this.mouse);
            }
        });

        MainMenuComponent.GameStarted.Connect(() => {
            this.SetCameraPosition();
        });
    }

    private async SetCameraPosition() {
        if (this.camera) {
            this.camera.CFrame = this.baseCameraPos.CFrame;
            this.GameInited = true;
        }
    }

    private Move(mouse: PlayerMouse) {
        if (this.camera && this.GameInited) {
            if (mouse.X > this.rightBorder) {
                this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(-this.sensitivity), 0));
            } else if (mouse.X < this.leftBorder) {
                this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(this.sensitivity), 0));
            }
        }
    }
}
