export interface MapGame extends Folder {
    CamStarterPoint: Part;
    AlternativeSpawn: Folder & {
        ["1"]: Part;
        ["3"]: Part;
        ["2"]: Part;
    };
    Alternative: Folder & {
        ["1"]: Part & {
            Decal: Decal;
        };
        ["3"]: Part & {
            Decal: Decal;
        };
        ["2"]: Part & {
            Decal: Decal;
        };
        ["5"]: Part & {
            Decal: Decal;
        };
        ["4"]: Part & {
            Decal: Decal;
        };
    };
    Purgatory: Folder & {
        ["Meshes/1lvlalter_Cube.001 (1)"]: MeshPart;
        ["Meshes/1lvlalter_Cube (1)"]: MeshPart;
        ["Meshes/1lvlalter_Cube.003 (1)"]: MeshPart & {
            SurfaceAppearance: SurfaceAppearance;
        };
        ["Meshes/1lvlalter_Cube.002 (1)"]: MeshPart;
    };
}
