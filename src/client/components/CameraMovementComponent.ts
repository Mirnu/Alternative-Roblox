import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Workspace } from "@rbxts/services";

@Component({
    tag: "CamStarter",
})
export class CameraMovementComponent extends BaseComponent<{}, BasePart> implements OnStart {
    private camera: Camera | undefined = Workspace.CurrentCamera;

    private sensitivity: number = 2;

    private rightBorder!: number;
    private leftBorder!: number;

    onStart(): void {
        if (this.camera !== undefined) {
            this.rightBorder = this.camera.ViewportSize.X - this.camera.ViewportSize.X / 8;
            this.leftBorder = this.camera.ViewportSize.X / 8;

            this.camera.CameraType = Enum.CameraType.Scriptable;
            this.camera.CFrame = this.instance.CFrame;
        }
    }

    public Move(mouse: PlayerMouse) {
        if (this.camera) {
            if (mouse.X > this.rightBorder) {
                this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(-this.sensitivity), 0));
            } else if (mouse.X < this.leftBorder) {
                this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(this.sensitivity), 0));
            }
        }
    }
}
