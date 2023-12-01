import { Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { IDection } from "../IDetection";

const FOVAngle = math.rad(40);

export class FirstDetection implements IDection {
    private camera: Camera | undefined = Workspace.CurrentCamera;

    Start(): void {
        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(0.1)) this.CheckAlternatives();
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
                    Events.RayProcces.fire(alternative);
                    will = true;
                }
            }
        });

        if (!will) {
            Events.RayProcces.fire(undefined);
        }
    }
}
