import { Components } from "@flamework/components";
import { Controller, OnStart, OnInit, Dependency } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";

const FOVAngle = math.rad(40);

@Controller({})
export class DetectionController implements OnStart {
    private camera: Camera | undefined = Workspace.CurrentCamera;
    private Alternatives = Workspace.WaitForChild("Map").WaitForChild("Alternative");

    constructor(private components: Components) {}

    onStart(): void {
        task.spawn(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.1)) {
                this.CheckAlternatives();
            }
        });
    }

    private CheckAlternatives() {
        let will = false;

        this.Alternatives.GetChildren().forEach((_alternative) => {
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
