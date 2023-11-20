import { Service, OnStart, OnInit } from "@flamework/core";
import { LevelService } from "./LevelService";
import { Lighting } from "@rbxts/services";

@Service({})
export class DayService implements OnStart {
    constructor(private levelService: LevelService) {}

    onStart() {
        this.levelService.GameStarted.Connect(() => {
            // eslint-disable-next-line roblox-ts/lua-truthiness
            while (task.wait(0.05)) {
                Lighting.ClockTime += 0.001;
            }
        });
    }
}
