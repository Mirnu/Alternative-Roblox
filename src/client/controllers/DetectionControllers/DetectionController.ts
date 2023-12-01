import { Controller } from "@flamework/core";
import { IDection } from "./IDetection";
import { FirstDetection } from "./modules/FirstDetection";
import { OnReplicaCreated } from "shared/Decorators/ReplicaDecorators";
import { PlayerDataReplica } from "types/Replica";
import { SessionStatus } from "shared/types/SessionStatus";

const typesDetections = new Map<number, IDection>([[1, new FirstDetection()]]);

@Controller({})
export class DetectionController {
    private CheckAltnernativesThread?: thread;

    @OnReplicaCreated()
    public Init(replica: PlayerDataReplica) {
        replica.ListenToChange("Static.SessionStatus", (newValue) => {
            if (newValue === SessionStatus.Playing) {
                this.CheckAltnernativesThread = task.spawn(() =>
                    typesDetections.get(replica.Data.Static.Night)?.Start(),
                );
            } else if (newValue === SessionStatus.Menu && this.CheckAltnernativesThread)
                task.cancel(this.CheckAltnernativesThread);
        });
    }
}
