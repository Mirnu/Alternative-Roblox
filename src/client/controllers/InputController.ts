import { Controller, OnRender, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { bindles } from "shared/Decorators/BindleDecorators";
import { ClickState, InputState } from "shared/types/InputState";

const myCurrentFunc: Map<Callback, thread> = new Map<Callback, thread>();

const CheckPressFuncks = (keyCode: Enum.KeyCode, state: InputState) => {
    for (const [key, value] of bindles) {
        if (key[0] === keyCode && key[1][1] === state && key[1][0] === ClickState.press) {
            return ClickState.press;
        }
    }

    return ClickState.pinch;
};

const GetFuncks = (keyCode: Enum.KeyCode, state: InputState) => {
    const funcks: Array<Callback> = new Array<Callback>();

    for (const [key, value] of bindles) {
        if (key[0] === keyCode && key[1][1] === state) {
            funcks.push(value);
        }
    }

    return funcks;
};

const DelCurrentsFuncks = (endFuncks: Array<Callback>) => {
    endFuncks.forEach((func) => {
        if (func && myCurrentFunc.get(func)) {
            const thread = myCurrentFunc.get(func) as thread;
            myCurrentFunc.delete(func);
            task.cancel(thread);
        }
    });
};

const StartFunkcs = (funcks: Array<Callback>, click: ClickState) => {
    funcks.forEach((func) => {
        const thr = task.spawn(() => {
            func();
        });

        if (click === ClickState.pinch) myCurrentFunc.set(func, thr);
    });
};

@Controller({})
export class InputController implements OnStart {
    private Began(input: InputObject) {
        const click = CheckPressFuncks(input.KeyCode, InputState.Ended);

        if (click === ClickState.pinch) {
            const endFuncks = GetFuncks(input.KeyCode, InputState.Ended);
            DelCurrentsFuncks(endFuncks);
        }

        const funcks = GetFuncks(input.KeyCode, InputState.Began);
        StartFunkcs(funcks, click);
    }

    private Ended(input: InputObject) {
        const click = CheckPressFuncks(input.KeyCode, InputState.Began);

        if (click === ClickState.pinch) {
            const endFuncks = GetFuncks(input.KeyCode, InputState.Began);
            DelCurrentsFuncks(endFuncks);
        }

        const funcks = GetFuncks(input.KeyCode, InputState.Ended);
        StartFunkcs(funcks, click);
    }

    onStart() {
        UserInputService.InputBegan.Connect((input) => {
            this.Began(input);
        });

        UserInputService.InputEnded.Connect((input) => {
            this.Ended(input);
        });
    }
}
