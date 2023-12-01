import { Dependency } from "@flamework/core";
import type { PlayerController } from "client/controllers/PlayerController";
import CallFunction from "shared/utils/CallFunction";
import { PlayerDataReplica } from "types/Replica";

type CallbackWithReplica = (replica: PlayerDataReplica) => unknown;

export function OnReplicaCreated() {
    return function <C extends object>(
        target: unknown,
        propertyName: string,
        descriptor: TypedPropertyDescriptor<CallbackWithReplica>,
    ) {
        const Ttarget = target as unknown as { constructor: Callback };
        const callback = Ttarget.constructor;

        Ttarget.constructor = function (this, ...args: unknown[]) {
            task.spawn(() => {
                const replicaController = Dependency<PlayerController>();
                const replica = replicaController.GetReplicaAsync();
                CallFunction(descriptor.value, this as C, replica);
            });
            callback(this, ...args);
        };

        return descriptor;
    };
}
