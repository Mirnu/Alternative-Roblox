import { Controller, OnStart, OnInit, Dependency } from "@flamework/core";
import { ReplicaController } from "@rbxts/replicaservice";
import { Workspace } from "@rbxts/services";
import { LocalPlayer } from "client/LocalPlayer";
import { SessionStatus } from "shared/types/SessionStatus";

const regen = 0.5;

const CameraRestriction = new ReadonlyMap<number, [number, number]>([[1, [170, 1]]]);

@Controller({})
export class CameraController implements OnStart, OnInit {
    private camera?: Camera = Workspace.CurrentCamera;
    private baseCameraPos = Workspace.WaitForChild("Map").WaitForChild("CamStarterPoint") as BasePart;
    private MenuCameraPos = Workspace.WaitForChild("Menu").WaitForChild("CamStarterPoint") as BasePart;
    private mouse: PlayerMouse = LocalPlayer.GetMouse();

    private sensitivity: number = 2;

    private rightCameraRestriction!: number;
    private leftCameraRestriction!: number;

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

    public Init() {
        ReplicaController.ReplicaOfClassCreated("PlayerState", (replica) => {
            replica.ListenToChange(["SessionStatus"], (newValue) => {
                if (newValue === SessionStatus.Playing) {
                    this.SetCameraPosition();
                    this.SetCameraRestriction(replica.Data.Night);
                } else if (newValue === SessionStatus.Menu) {
                    this.SetMenuCamera();
                }
            });
        });
    }

    private SetCameraRestriction(level: number) {
        const cameraRestriction = CameraRestriction.get(level);
        if (cameraRestriction === undefined) return;

        this.rightCameraRestriction = cameraRestriction[1];
        this.leftCameraRestriction = cameraRestriction[0];
    }

    private SetCameraPosition() {
        if (this.camera && this.baseCameraPos) {
            this.camera.CFrame = this.baseCameraPos.CFrame;
            this.GameInited = true;
        }
    }

    private SetMenuCamera() {
        if (this.camera === undefined) return;
        this.camera.CFrame = this.MenuCameraPos.CFrame;
        this.GameInited = false;
    }

    private Move(mouse: PlayerMouse) {
        if (!this.GameInited) return;
        if (this.camera === undefined) return;

        const right =
            mouse.X > this.rightBorder &&
            math.deg(this.camera.CFrame.Rotation.ToOrientation()["1"]) > this.rightCameraRestriction;
        const left =
            mouse.X < this.leftBorder &&
            math.deg(this.camera.CFrame.Rotation.ToOrientation()["1"]) < this.leftCameraRestriction;

        if (right) {
            this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(-this.sensitivity), 0));
        } else if (left) {
            this.camera.CFrame = this.camera.CFrame.mul(CFrame.Angles(0, math.rad(this.sensitivity), 0));
        }
    }
}
