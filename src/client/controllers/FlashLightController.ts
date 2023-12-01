import { Controller, OnStart, OnRender } from "@flamework/core";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { SessionStatus } from "shared/types/SessionStatus";
import { PlayerDataReplica } from "types/Replica";

@Controller({})
export class FlashLightController implements OnStart, OnRender {
    private camera = Workspace.CurrentCamera!;
    private player = Players.LocalPlayer;
    private part!: BasePart;
    private spotLight?: SpotLight;
    private isCan = false;

    onStart() {
        const flashLight = this.createFlashLight();
        this.part = flashLight.part;
        this.spotLight = flashLight.spotLight;

        UserInputService.InputBegan.Connect((input) => {
            if (input.KeyCode === Enum.KeyCode.Space) this.EnableFlashLight();
        });
        UserInputService.InputEnded.Connect((input) => {
            if (input.KeyCode === Enum.KeyCode.Space) this.DisableFlashLight();
        });
    }

    private createFlashLight() {
        const part = new Instance("Part");
        part.Parent = Workspace;
        part.Size = new Vector3(1, 1, 1);
        part.Anchored = true;
        part.Transparency = 1;
        const spotLight = new Instance("SpotLight");
        spotLight.Parent = part;
        spotLight.Angle = 90;
        spotLight.Brightness = 5;
        spotLight.Range = 60;
        spotLight.Shadows = true;
        spotLight.Enabled = false;
        return { part, spotLight };
    }

    @OnReplicaCreated()
    public Init(replica: PlayerDataReplica) {
        replica.ListenToChange("Static.SessionStatus", (newValue) => {
            if (newValue === SessionStatus.Playing) {
                if (replica.Data.Static.Night === 2) {
                    this.isCan = true;
                }
            } else if (newValue === SessionStatus.Menu) this.isCan = false;
        });
    }

    @OnReplicaCreated()
    private initFlashLight(replica: PlayerDataReplica) {
        replica.ListenToChange("Dynamic.FlashLight", (newValue) => {
            this.spotLight!.Angle = newValue * 0.9;
            this.spotLight!.Brightness = newValue * 0.05;
        });
    }

    onRender(dt: number) {
        if (!this.isCan) return;
        this.part.CFrame = this.camera.CFrame.add(this.camera.CFrame.LookVector.mul(50));
    }

    private EnableFlashLight() {
        this.spotLight!.Enabled = true;
        Events.FlashLightEnable.fire();
    }

    private DisableFlashLight() {
        this.spotLight!.Enabled = false;
        Events.FlashLightDisable.fire();
    }
}
