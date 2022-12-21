import {app, BrowserWindow, screen, globalShortcut, Display} from 'electron';
import minBy from 'lodash/minBy';
import gsap from 'gsap';

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
        });
        window?.setPosition(isShown ? targetDisplay.workArea.x : targetDisplay.workArea.x - targetDisplay.workArea.width/2, targetDisplay.workArea.y);
        window?.setSize(targetDisplay.workArea.width/2, targetDisplay.workArea.height);
    }

    const create = () => {
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
            },
        });
        updateWindowPosition();
        window?.setMenu(null);
        globalShortcut.register('CommandOrControl+Tab', () => toggleShow());
        screen.on('display-metrics-changed', () => updateWindowPosition());
        screen.on('display-added', () => updateWindowPosition());
        screen.on('display-removed', () => updateWindowPosition());
        if (process.env.VITE_DEV_SERVER_URL) {
            window?.loadURL(process.env.VITE_DEV_SERVER_URL)
        } else {
            window?.loadFile('index.html');
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

const mainWindow = defineMainWindow();
app.on('ready', () => {
    mainWindow.create();
});

app.on('quit', () => {
    mainWindow.destroy();
});
