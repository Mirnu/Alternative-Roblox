import { Replica } from "@rbxts/replicaservice";
import { SessionStatus } from "../shared/types/SessionStatus";

declare global {
    interface Replicas {
        PlayerState: {
            Data: {
                Static: {
                    Night: number;
                    SessionStatus: SessionStatus;
                };
                Dynamic: {
                    Mental: number;
                    FlashLight: number;
                    EyeOpened: boolean;
                };
            };
        };
    }
}

export type PLayerStateData = {
    Static: {
        Night: number;
        SessionStatus: SessionStatus;
    };
    Dynamic: {
        Mental: number;
        FlashLight: number;
        EyeOpened: boolean;
    };
};
export type PlayerDataReplica = Replica<"PlayerState">;
