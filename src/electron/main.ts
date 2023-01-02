import {app, BrowserWindow, screen, globalShortcut, Display, protocol, Tray, Menu} from 'electron';
import AutoLaunch from 'auto-launch';
import minBy from 'lodash/minBy';
import gsap from 'gsap';
import {join} from 'path';
import * as path from 'path'
import * as url from 'url'
import pkg from '../../package.json'

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}
type Point = {
    x: number;
    y: number;
}

const defineMainWindow = () => {
    let window: BrowserWindow | null;
    let targetDisplay: Display;
    let isShown = process.env.NODE_ENV === 'development';

    const show = (bounds: Rect, target: Point) => {
        gsap.to(bounds, .3, {x: target.x, roundProps:"x",
            onStart: () => {
                window?.setPosition(target.x - bounds.width, target.y);
                window?.setOpacity(1)
            },
            onUpdate: function(){
                window?.setPosition(bounds.x, bounds.y);
                window?.focus();
            },
            onComplete: function(){
                window?.setPosition(target.x, target.y);
                window?.focus();
            }
        });

    }
    const hide = (bounds: Rect, target: Point) => {
        gsap.to(bounds, .3, {x: target.x - bounds.width, roundProps:"x",
            onUpdate: function(){
                window?.setPosition(bounds.x, bounds.y);
            },
            onComplete: function(){
                window?.setPosition(target.x - bounds.width, target.y);
                window?.setOpacity(0)
            }
        });

    }
    const toggleShow = () => {
        const immediate = false;
        const bounds: Rect = {
            x: window?.getPosition()[0] ?? 0,
            y: window?.getPosition()[1] ?? 0,
            width: window?.getSize()[0] ?? 0,
            height: window?.getSize()[1] ?? 0
        };
        let targetDisplayPostion: Point = {
            x: targetDisplay.workArea.x,
            y: targetDisplay.workArea.y
        };
        if(!isShown){
            if (immediate) {
                window?.setPosition(targetDisplayPostion.x, targetDisplayPostion.y);
            } else {
                show(bounds, targetDisplayPostion);
            }
        } else {
            if (immediate){
                window?.setPosition(targetDisplayPostion.x - (bounds.width ?? 0), targetDisplayPostion.y);
            } else {
                hide(bounds, targetDisplayPostion);
            }
        }
        isShown = !isShown;
    }

    const updateWindowPosition = () => {
        const allDisplays = screen.getAllDisplays();
        targetDisplay = minBy(allDisplays, (display) => {
            return  display.bounds.x;
        }) || screen.getPrimaryDisplay();
        window?.setPosition(isShown ? targetDisplay.workArea.x : targetDisplay.workArea.x - targetDisplay.workArea.width/2, targetDisplay.workArea.y);
        window?.setSize(targetDisplay.workArea.width/2, targetDisplay.workArea.height);
    }

    const create = async () => {
        window = new BrowserWindow({
            frame: false,
            alwaysOnTop: true,
            center: false,
            maximizable: false,
            resizable: true,
            skipTaskbar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webviewTag: true,
            },
        });
        updateWindowPosition();
        window?.setMenu(null);
        globalShortcut.register('CommandOrControl+Tab', () => toggleShow());
        screen.on('display-metrics-changed', () => updateWindowPosition());
        screen.on('display-added', () => updateWindowPosition());
        screen.on('display-removed', () => updateWindowPosition());
        window.on('blur', () => {
            if (isShown && process.env.NODE_ENV !== 'development') {
                toggleShow();
            }
        })
        if (process.env.VITE_DEV_SERVER_URL) {
            await window?.loadURL(process.env.VITE_DEV_SERVER_URL)
            window.webContents.openDevTools({
                mode: 'detach'
            });
        } else {
            await window?.loadFile(join(__dirname, `../dist/index.html`))
        }
    }

    const destroy = () => {
        window = null;
    }
    return {
        create,
        destroy,
    }
}

let trayInstance: Tray | null
const defineTray = () => {
    const create = () => {
        trayInstance = new Tray(join(__dirname, '../icon.png'))
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Exit', type: 'normal', role: 'quit' },
        ])
        trayInstance.setToolTip(`${app.name} - v${app.getVersion()}`)
        trayInstance.setContextMenu(contextMenu)
    }
    const destroy = () => {
        trayInstance = null
    }
    return {
        create,
        destroy,
    }
}

const mainWindow = defineMainWindow();
const tray = defineTray();
app.on('ready', () => {
    const launcher = new AutoLaunch({
        name: pkg.productName,
        path: app.getPath('exe'),
    });
    launcher.isEnabled()
        .then((isEnabled: boolean) => {
            if(isEnabled){
                return;
            }
            launcher.enable();
        })
    mainWindow.create();
    tray.create();
});

app.on('quit', () => {
    mainWindow.destroy();
    tray.destroy();
});
