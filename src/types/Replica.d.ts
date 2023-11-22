import { Replica } from "@rbxts/replicaservice";
import { SessionStatus } from "../shared/types/SessionStatus";

declare global {
    interface Replicas {
        GameState: {
            Data: {
                Mental: number;
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

export type PlayerDataReplica = Replica<"GameState">;
