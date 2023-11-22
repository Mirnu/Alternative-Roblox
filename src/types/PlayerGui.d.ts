interface PlayerGui extends Instance {
    PlayerGui: ScreenGui & {
        Eyes: Folder & {
            down: ImageLabel & {
                Frame: Frame;
            };
            up: ImageLabel & {
                Frame: Frame;
            };
        };
    };

    MainMenu: ScreenGui & {
        Texts: Folder & {
            ["0"]: ImageLabel & {
                text: TextButton;
            };
            ["1"]: ImageLabel & {
                text: TextButton;
            };
            ["4"]: ImageLabel & {
                text: TextButton;
            };
            ["3"]: ImageLabel & {
                text: TextButton;
            };
            ["2"]: ImageLabel & {
                text: TextButton;
            };
        };
    };
}
