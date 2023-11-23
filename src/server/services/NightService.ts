import { Service, OnStart, OnInit } from "@flamework/core";
import { LevelService } from "./LevelService";
import { Lighting } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { PlayerService } from "./PlayerService";
import { player } from "types/Player";
import { Events } from "server/network";

const TIME_DELAY = 0.1;
const TIME_DELTA = 0.002;

@Service({})
export class DayService implements OnStart {
    constructor(private levelService: LevelService) {}

    public FinishSignal = new Signal();

    onStart() {
        this.levelService.GameStarted.Connect(() => this.StartNightCycle());
    }

    private StartNightCycle() {
        Lighting.ClockTime = 0;

        // eslint-disable-next-line roblox-ts/lua-truthiness
        while (task.wait(TIME_DELAY)) {
            Lighting.ClockTime += TIME_DELTA;

            if (Lighting.ClockTime >= 7) {
                break;
            }
        }

        this.FinishSignal.Fire();
    }
}
