"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import fs from "fs";
import electron from "electron";
import log from "electron-log";
import fetch from "node-fetch";
import MSMC from "msmc";
import windowStateKeeper from "electron-window-state";

Object.assign(console, log.functions);

MSMC.setFetch(fetch);

const shell = electron.shell;
const isDevelopment = process.env.NODE_ENV !== "production";
const initPath = path.join(app.getPath("userData"), "init.json");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

var win;

async function createWindow() {
    let winState = windowStateKeeper({
        defaultWidth: 1420,
        defaultHeight: 820,
    });

    // Create the browser window.
    win = new BrowserWindow({
        x: winState.x,
        y: winState.y,
        width: winState.width,
        height: winState.height,
        minWidth: 1040,
        title: "UNIVERSE Launcher",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: false,
            //webSecurity: false,
        },
    });

    winState.manage(win);

    win.setBackgroundColor("#263238");
    win.setMenuBarVisibility(false);
    win.setMenu(null);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }

    win.on("close", () => {
        var data = { bounds: win.getBounds() };
        try {
            fs.writeFileSync(initPath, JSON.stringify(data));
            // eslint-disable-next-line no-empty
        } catch (err) {}
    });

    win.webContents.on("new-window", function(e, url) {
        // make sure local urls stay in electron perimeter
        if (
            "file://" === url.substr(0, "file://".length) ||
            url.startsWith("https://login.live.com/")
        ) {
            console.log("Nativ window allowed.");
            return;
        }
        console.log("Opening link through shell.");
        // and open every other protocols on the browser
        e.preventDefault();
        shell.openExternal(url);
    });

    const cors_filter = {
        urls: ["*://addons-ecs.forgesvc.net/*"],
    };
    win.webContents.session.webRequest.onBeforeSendHeaders(cors_filter, (details, callback) => {
        details.requestHeaders["Origin"] = null;
        callback({ requestHeaders: details.requestHeaders });
    });
    win.webContents.session.webRequest.onHeadersReceived(cors_filter, (details, callback) => {
        details.responseHeaders["Access-Control-Allow-Origin"] = "*";
        callback({ responseHeaders: details.responseHeaders });
    });
}

if (app.requestSingleInstanceLock()) {
    app.on("second-instance", (event, commandLine) => {
        console.log("Second instance was started with parameters:", commandLine);
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });
} else {
    app.exit();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

// IPC Remote events

ipcMain.on("open-file-dialog", async (event, args) => {
    try {
        let files = await dialog.showOpenDialog(win, args);
        event.sender.send("open-file-dialog_result", files);
    } catch (err) {
        event.sender.send("open-file-dialog_result", { canceled: true });
        console.error(err);
    }
});

ipcMain.on("user_data_path", (event) => {
    event.sender.send("user_data_path", {
        userData: app.getPath("userData"),
        documents: app.getPath("documents"),
    });
});

ipcMain.on("log_path", (event) => {
    event.sender.send("log_path", { logPath: log.transports.file.getFile().path });
});

ipcMain.on("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("check_updates", (event) => {
    console.log("Checking for updates...");
    autoUpdater.checkForUpdatesAndNotify();
    if (isDevelopment) event.sender.send("update_info", { updateAvailable: false });
});

ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", () => {
    console.log("update available");
    win.webContents.send("update_info", { updateAvailable: true });
});

autoUpdater.on("update-not-available", () => {
    console.log("no update available");
    win.webContents.send("update_info", { updateAvailable: false });
});

autoUpdater.on("download-progress", (info) => {
    win.webContents.send("update_download_progress", info);
});

autoUpdater.on("update-downloaded", () => {
    win.webContents.send("update_downloaded");
});

autoUpdater.on("error", (error) => {
    win.webContents.send("update_info", { updateAvailable: false });
    console.error("Error while updating: " + error);
    log.error("Error while updating: " + error);
});

ipcMain.on("clear_cache", (event) => {
    console.log("Clearing electron cache...");
    win.webContents.session.clearCache(() => {
        console.log("Successfully cleared caches");
        event.sender.send("cleared_cache");
    });
});

ipcMain.on("login_oauth2_ms", async (event) => {
    try {
        var res = await MSMC.fastLaunch(
            "electron",
            (update) => {
                event.sender.send("login_oauth2_ms_update", update);
            },
            "select_account"
        );
        event.sender.send("login_oauth2_ms_callback", {
            access_token: res.access_token,
            profile: res.profile,
        });
    } catch (err) {
        event.sender.send("login_oauth2_ms_error", err);
    }
});

ipcMain.on("refresh_oauth2_ms", async (event, args) => {
    try {
        var res = await MSMC.refresh(args, (update) => {
            event.sender.send("refresh_oauth2_ms_update", update);
        });
        event.sender.send("refresh_oauth2_ms_callback", {
            access_token: res.access_token,
            profile: res.profile,
        });
    } catch (err) {
        event.sender.send("refresh_oauth2_ms_error", err);
    }
});

/*ipcMain.handle("refresh_mojang", async (event, value) => {
    let response = await MSMC.getMCLC().refresh({
        access_token: value.accessToken,
        client_token: value.clientToken,
    });
    return response;
});
*/
