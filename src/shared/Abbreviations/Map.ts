import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { MapGame } from "types/MapGame";
import { PrefabsGame } from "types/PrefabGame";

export const mapGame = Workspace.WaitForChild("Map") as MapGame;
export const Prefabs = ReplicatedStorage.WaitForChild("Prefabs") as PrefabsGame;
