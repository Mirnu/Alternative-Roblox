import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
    EyeClosed(): void;
    EyeOpened(): void;
    RayProcces(object: Instance | undefined): void;
}

interface ServerToClientEvents {
    GameInited(): void;
}

interface ClientToServerFunctions {
    GameStarted(): boolean;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
