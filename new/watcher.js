class Watcher {
    constructor(data, expr, cb) {
        this.data = data
        this.expr = expr
        this.cb = cb
        // 缓存旧值
        this.oldVal = this.get()
    }
    get() {
        // 缓存当前watcher 为什么要置为null
        Dep.target = this
        // 触发observer里的get来收集依赖
        let val = this.getVal()
        // 这里设置为null，在observer时才不会重复添加watcher到subs里
        Dep.target = null
        return val
    }
    getVal() {
        return getValueByPath(this.data, this.expr)
    }
    update() {
        let newVal = this.getVal()
        if (newVal !== this.oldVal) {
            // 更新视图
            this.cb(newVal)
        }
    }
}

// 对象深层查找(此处调用了 Object.defineProperty 的 get 方法)
function getValueByPath(obj, path) {
    let pathArr = path.split('.');
    let prop;
    // 难点
    while (prop = pathArr.shift()) {
        obj = obj[prop]
    }
    return obj
}