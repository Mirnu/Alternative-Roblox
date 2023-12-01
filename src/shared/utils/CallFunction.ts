declare function CallFunction<T extends Callback>(
    func: T,
    context: InferThis<T>,
    ...parameters: Parameters<T>
): ReturnType<T>;
declare function CallFunction<T extends Callback>(func: T, ...parameters: Parameters<T>): ReturnType<T>;

export = CallFunction;
