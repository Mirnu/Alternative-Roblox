import { Replica } from "@rbxts/replicaservice";
import { SessionStatus } from "../shared/types/SessionStatus";

declare global {
    interface Replicas {
        GameState: {
            Data: {
                Mental: number;
                FlashLight: number;
            };
        };
        PlayerState: {
            Data: {
                Night: number;
                SessionStatus: SessionStatus;
            };
        };
    }
}

export type PLayerData = { Night: number; SessionStatus: SessionStatus };
export type PlayerDataReplica = Replica<"GameState">;
