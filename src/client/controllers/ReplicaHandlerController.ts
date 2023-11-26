import { Components } from "@flamework/components";
import { Controller, OnStart, OnInit } from "@flamework/core";
import { ReplicaController } from "@rbxts/replicaservice";
import { MainMenuComponent } from "client/components/UI/MainMenuComponent";
import { CameraController } from "./CameraController";
import { MentalController } from "./MentalController";
import { DetectionController } from "./DetectionController";
import { EyeComponents } from "client/components/UI/EyeComponents";
import { FlashLightController } from "./FlashLightController";

@Controller({
    loadOrder: 2,
})
export class ReplicaHandlerController implements OnStart {
    constructor(
        private components: Components,
        private cameraController: CameraController,
        private mentalController: MentalController,
        private detectionController: DetectionController,
        private flashLightController: FlashLightController,
    ) {}

    private InitMainMenuComponents() {
        const mainMenuComponents = this.components.getAllComponents<MainMenuComponent>();

        mainMenuComponents.forEach((value) => {
            value.Init();
        });
    }

    private InitEyeComponents() {
        const EyeComponents = this.components.getAllComponents<EyeComponents>();

        EyeComponents.forEach((value) => {
            value.Init();
        });
    }

    onStart() {
        this.InitMainMenuComponents();
        this.InitEyeComponents();
        this.flashLightController.Init();
        this.mentalController.MentalChanged();
        this.cameraController.Init();
        this.detectionController.Init();
        ReplicaController.RequestData();
    }
}
