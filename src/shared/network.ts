import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
    EyeClosed(): void;
    EyeOpened(): void;
    RayProcces(object: Instance | undefined): void;
    NewGame(): void;
    ContinueGame(): void;
}

interface ServerToClientEvents {
    GameInited(night: number): void;
    GameFinished(): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
