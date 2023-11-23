import { Components } from "@flamework/components";
import { Controller, OnStart, OnInit } from "@flamework/core";
import { ReplicaController } from "@rbxts/replicaservice";
import { MainMenuComponent } from "client/components/UI/MainMenuComponent";
import { CameraController } from "./CameraController";
import { MentalController } from "./MentalController";
import { GuiController } from "./GuiController";
import { DetectionController } from "./DetectionController";

@Controller({
    loadOrder: 2,
})
export class ReplicaHandlerController implements OnStart {
    constructor(
        private components: Components,
        private cameraController: CameraController,
        private mentalController: MentalController,
        private detectionController: DetectionController,
    ) {}

    private InitMainMenuComponents() {
        const mainMenuComponents = this.components.getAllComponents<MainMenuComponent>();
        print(mainMenuComponents, " was a Main Menu Components");

        mainMenuComponents.forEach((value) => {
            value.Init();
        });
    }

    onStart() {
        this.InitMainMenuComponents();
        this.mentalController.MentalChanged();
        this.cameraController.Init();
        this.detectionController.Init();
        ReplicaController.RequestData();
    }
}
