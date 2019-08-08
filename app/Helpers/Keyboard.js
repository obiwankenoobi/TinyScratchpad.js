export class Keyboard {
    constructor() {
        this.meta = false;
        this.s = false;
    }

    keyDown(e, cb) {
        if (e.key === "Meta") this.meta = true; 
        if (e.key === "s")    this.s    = true;

        if (this.meta && this.s) {
            cb();
            this.meta = false;
            this.s    = false;
        }
    }

    keyUp(e) {
        if (e.key === "Meta") this.meta = false;
        if (e.key === "s")    this.s    = false;
    }

    addSaveListener(cb) {
        window.addEventListener("keydown", e => this.keyDown(e, cb));
        window.addEventListener("keyup", e => this.keyUp(e));
    }

    removeSaveListener() {
        window.removeEventListener("keydown", this.keyUp);
        window.removeEventListener("keyup", this.keyDown);
    }

}