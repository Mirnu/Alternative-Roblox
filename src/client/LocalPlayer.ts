import { Players } from "@rbxts/services";

export const LocalPlayer = Players.LocalPlayer;
export const Character = LocalPlayer.CharacterAdded.Wait() as never as Player["Character"];
export const GetHumanoid = () => {
    if (Character !== undefined) return Character.WaitForChild("Humanoid");
};
