import EventEmitter from "events"

class XtermHelper {
    constructor() {
        this.instance = null
        this.emitter = new EventEmitter();
        this.xtermInstance = false;
    }

    emit(event) {
        this.emitter.emit(event);
    }

    init(instance) {
        this.instance = instance;
    }
}

export const xtermInstance = new XtermHelper();
