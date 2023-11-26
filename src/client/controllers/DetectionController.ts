import { Components } from "@flamework/components";
import { Controller, OnStart, OnInit, Dependency } from "@flamework/core";
import { Task } from "@rbxts/fusion";
import { ReplicaController } from "@rbxts/replicaservice";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { SessionStatus } from "shared/types/SessionStatus";

const FOVAngle = math.rad(40);

@Controller({})
export class DetectionController implements OnStart {
    private camera: Camera | undefined = Workspace.CurrentCamera;
    private CheckAltnernativesThread?: thread;

    onStart(): void {}

    private InitCheckAlternatives() {
        this.CheckAltnernativesThread = task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.1)) this.CheckAlternatives();
        });
    }

    public Init() {
        ReplicaController.ReplicaOfClassCreated("PlayerState", (replica) => {
            replica.ListenToChange("SessionStatus", (newValue) => {
                if (newValue === SessionStatus.Playing && replica.Data.Night < 2) this.InitCheckAlternatives();
                else if (newValue === SessionStatus.Menu && this.CheckAltnernativesThread)
                    task.cancel(this.CheckAltnernativesThread);
            });
        });
    }

    private CheckAlternatives() {
        let will = false;

        if (Workspace.FindFirstChild("Map")?.FindFirstChild("Alternative") === undefined) return;

        Workspace.Map.Alternative.GetChildren().forEach((_alternative) => {
            if (this.camera) {
                const alternative = _alternative as BasePart;
                const npcPosition = alternative.CFrame.Position;
                // eslint-disable-next-line prettier/prettier
                const dirVector = (npcPosition.sub(this.camera?.CFrame.Position)).Unit;

                const dotProduct = dirVector.Dot(this.camera.CFrame.LookVector);

                if (math.acos(dotProduct) < FOVAngle) {
                    this.RayProcess(alternative);
                    will = true;
                }
            }
        });

        if (!will) {
            this.RayProcess(undefined);
        }
    }

    public RayProcess(object?: Instance) {
        Events.RayProcces.fire(object);
    }
}
