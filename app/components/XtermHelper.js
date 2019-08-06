class XtermHelper {
    constructor() {
        this.instane = null
    }

    init(instance) {
        this.instane = instance;
    }
}

export const xtermInstance = new XtermHelper();
