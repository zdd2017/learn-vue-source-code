class Watcher {
    constructor(expr, data, cb) {
        this.expr = expr
        this.data = data
        this.cb = cb
        // 缓存旧值
        this.oldVal = this.get()
    }
    get() {
        let value = getValueByPath(this.data, this.expr);
        Dep.target = this
        return value
    }
    update() {
        let newVal = getValueByPath(this.data, this.expr)
        if (this.oldVal !== newVal) {
            this.cb(newVal)
        }
    }
}