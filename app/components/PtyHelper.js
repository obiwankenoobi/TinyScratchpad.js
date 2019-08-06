export class PtyHelper {
  instance = null;

  init(instance) {
    this.instance = instance;
  }
}

export const ptyInstance = new PtyHelper();
