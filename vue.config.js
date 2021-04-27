module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Matix's Mod Installer - RN",
                appId: "net.matix-media.matixs-mod-installer",
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
                    icon: "./src/assets/images/branding/icon.icns",
                },
                win: {
                    icon: "./src/assets/images/branding/icon.ico",
                },
                linux: {
                    icon: "./src/assets/images/branding/icon.png",
                },
            },
        },
    },
};
