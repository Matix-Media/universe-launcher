export default class ReactiveVar {
    value;
    callback;

    constructor(val, callback) {
        this.value = val;
        this.callback = callback;
    }

    set(val) {
        this.value = val;
        this.callback(this);
    }

    get() {
        return this.value;
    }
}
