import { Controller, OnStart, OnInit, Dependency } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { LocalPlayer } from "client/LocalPlayer";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { SessionStatus } from "shared/types/SessionStatus";
import { PlayerDataReplica } from "types/Replica";

const CameraRestriction = new ReadonlyMap<number, [number, number]>([[1, [170, 1]]]);

@Controller({})
export class CameraController implements OnStart, OnInit {
    private camera?: Camera = Workspace.CurrentCamera;
    private MenuCameraPos = Workspace.WaitForChild("Menu").WaitForChild("CamStarterPoint") as BasePart;
    private mouse: PlayerMouse = LocalPlayer.GetMouse();

    private sensitivity: number = 2;

    private rightCameraRestriction?: number;
    private leftCameraRestriction?: number;

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
        this.SetMenuCamera();
        task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.01)) {
                this.Move(this.mouse);
            }
        });
    }

    @OnReplicaCreated()
    public Init(replica: PlayerDataReplica) {
        replica.ListenToChange("Static.SessionStatus", (newSessionStatus) => {
            if (newSessionStatus === SessionStatus.Playing) {
                this.SetCameraPosition();
                this.SetCameraRestriction(replica.Data.Static.Night);
            } else if (newSessionStatus === SessionStatus.Menu) {
                this.rightCameraRestriction = undefined;
                this.leftCameraRestriction = undefined;
                this.SetMenuCamera();
            }
        });
    }

    private SetCameraRestriction(level: number) {
        const cameraRestriction = CameraRestriction.get(level);
        if (cameraRestriction === undefined) return;

        this.rightCameraRestriction = cameraRestriction[1];
        this.leftCameraRestriction = cameraRestriction[0];
    }

    private SetCameraPosition() {
        if (this.camera) {
            print("Set pos");
            const CamStarterPoint = Workspace.WaitForChild("Map").WaitForChild("CamStarterPoint") as BasePart;
            this.camera.CFrame = CamStarterPoint.CFrame;
            this.GameInited = true;
        }
    }

    private SetMenuCamera() {
        if (this.camera === undefined) return;
        this.camera.CFrame = this.MenuCameraPos.CFrame;
        this.GameInited = false;
    }

    private canRight(mouse: PlayerMouse) {
        if (this.rightCameraRestriction !== undefined) {
            return (
                mouse.X > this.rightBorder &&
                math.deg(this.camera!.CFrame.Rotation.ToOrientation()["1"]) > this.rightCameraRestriction
            );
        }
        return mouse.X > this.rightBorder;
    }

    private canLeft(mouse: PlayerMouse) {
        if (this.leftCameraRestriction !== undefined) {
            return (
                mouse.X < this.leftBorder &&
                math.deg(this.camera!.CFrame.Rotation.ToOrientation()["1"]) < this.leftCameraRestriction
            );
        }
        return mouse.X < this.leftBorder;
    }

    private Move(mouse: PlayerMouse) {
        if (!this.GameInited) return;
        if (this.camera === undefined) return;

        if (this.canRight(mouse)) {
            this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(-this.sensitivity), 0));
        } else if (this.canLeft(mouse)) {
            this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(this.sensitivity), 0));
        }
    }
}
