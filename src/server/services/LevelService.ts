import { Service, OnStart, OnInit } from "@flamework/core";
import Signal from "@rbxts/signal";
import { Functions } from "server/network";

@Service({})
export class LevelService implements OnStart, OnInit {
    public GameStarted = new Signal<(level: number) => void>();

    onInit() {}

    private NewLevel(): boolean {
        this.GameStarted.Fire(1);
        return true;
    }

    onStart() {
        Functions.GameStarted.setCallback(() => this.NewLevel());
    }
}
