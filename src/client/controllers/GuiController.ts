import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { LocalPlayer } from "client/LocalPlayer";
import { EyeComponents } from "client/components/UI/EyeComponents";
import { MainMenuComponent } from "client/components/UI/MainMenuComponent";
import { player } from "types/Player";

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

type PlayerGuiKeyOf =
    | "CurrentScreenOrientation"
    | "ScreenOrientation"
    | "SelectionImageObject"
    | "_nominal_PlayerGui"
    | "TopbarTransparencyChangedSignal"
    | "SetTopbarTransparency"
    | "GetTopbarTransparency";

export type PlayerGuiChildrens = Omit<Omit<PlayerGui, keyof BasePlayerGui & keyof StarterGui>, PlayerGuiKeyOf>;

@Controller({})
export class GuiController implements OnStart {
    constructor(private components: Components) {}

    public player = LocalPlayer as player;

    onStart() {
        this.initComponents();
        this.EnableGui("PlayerGui");
    }

    public EnableGui(name: keyof PlayerGuiChildrens) {
        const instance = PlayerGui.FindFirstChild(name) as ScreenGui;
        assert(instance, `Not found screenGui ${name}`);

        instance.Enabled = true;
    }

    public DisableGui(name: keyof PlayerGuiChildrens) {
        const instance = PlayerGui.FindFirstChild(name) as ScreenGui;
        assert(instance, `Not found screenGui ${name}`);

        instance.Enabled = false;
    }

    public GetScreenGui<T extends keyof PlayerGuiChildrens>(name: T): PlayerGui[T] {
        return PlayerGui.WaitForChild(name) as PlayerGui[T];
    }

    public initComponents() {
        this.components.addComponent<EyeComponents>(this.GetScreenGui("PlayerGui").Eyes);
        this.components.addComponent<MainMenuComponent>(this.GetScreenGui("MainMenu"));
    }
}
