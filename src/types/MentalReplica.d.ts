import { Replica } from "@rbxts/replicaservice";

declare global {
    interface Replicas {
        Mental: {
            Data: {
                Mental: number;
            };
        };
    }
}

export type PlayerDataReplica = Replica<"Mental">;
