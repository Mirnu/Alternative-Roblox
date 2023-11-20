interface ReplicatedStorage extends Instance {
    Temp: Folder & {
        Alternatives: Folder;
    };

    Prefabs: Folder & {
        Alternatives: Folder & {
            ["1"]: Part & {
                Decal: Decal;
            };
        };
    };
}
