import { ClickState, InputState } from "shared/types/InputState";

type BindleInvoke = () => void;

export function Bindle(key: Enum.KeyCode, state: InputState, click: ClickState) {
    return function (target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Callback>) {
        const Ttarget = target as never as { constructor: Callback };
        const callback = Ttarget.constructor;

        Ttarget.constructor = function (this, ...args: unknown[]) {
            bindles.set([key, [click, state]], () => descriptor.value(this));
            return callback(this, ...args);
        };

        return descriptor;
    };
}

export const bindles: Map<[Enum.KeyCode, [ClickState, InputState]], BindleInvoke> = new Map<
    [Enum.KeyCode, [ClickState, InputState]],
    BindleInvoke
>();
