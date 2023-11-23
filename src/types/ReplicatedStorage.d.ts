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
        Maps: Folder & {
            ["1"]: Folder & {
                Map: Folder & {
                    CamStarterPoint: Part;
                    AlternativeSpawn: Folder & {
                        ["1"]: Part;
                        ["3"]: Part;
                        ["2"]: Part;
                    };
                    Alternative: Folder;
                    Purgatory: Folder & {
                        ["Meshes/1lvlalter_Cube.001 (1)"]: MeshPart;
                        ["Meshes/1lvlalter_Cube (1)"]: MeshPart;
                        ["Meshes/1lvlalter_Cube.003 (1)"]: MeshPart & {
                            SurfaceAppearance: SurfaceAppearance;
                        };
                        ["Meshes/1lvlalter_Cube.002 (1)"]: MeshPart;
                    };
                };
            };
        };
    };
}
