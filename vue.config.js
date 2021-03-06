module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "UNIVERSE Launcher",
                appId: "net.matix-media.universe-launcher",
                dmg: {
                    contents: [
                        {
                            x: 410,
                            y: 150,
                            type: "link",
                            path: "/Applications",
                        },
                        {
                            x: 130,
                            y: 150,
                            type: "file",
                        },
                    ],
                },
                directories: {
                    output: "build",
                },
                mac: {
                    target: ["dmg", "zip"],
                    icon: "./src/assets/images/branding/icon.icns",
                },
                win: {
                    target: ["nsis", "zip"],
                    icon: "./src/assets/images/branding/app_icon.ico",
                    publisherName: "Matix Media",
                },
                linux: {
                    target: ["AppImage", "zip"],
                    icon: "./src/assets/images/branding/app_icon.png",
                },
            },
        },
    },
};
