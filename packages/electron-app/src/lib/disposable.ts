class Disposer {
    constructor(dispose) {
        this.dispose = dispose;
    }
    dispose() {
        this.dispose();
    }
}

export { Disposer };