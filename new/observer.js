class Observer {
    constructor(data) {
        this.observe(data)
    }
    observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        for (let key in data) {
            this.defineReactive(data, key, data[key])
            this.observe(data[key])
        }
    }
    defineReactive(obj, key, value) {
        let dep = new Dep()
        let that = this
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log(dep.subs, key + '-before')
                console.log(Dep.target)
                // 订阅 怎么获得当前watcher
                if (Dep.target) {
                    console.log('有watcher')
                    dep.addSub(Dep.target)
                }
                console.log(dep.subs, key + '-subs')
                return value
            },
            set(newVal) {
                console.log('setvalue')
                if (newVal !== value) {
                    that.observe(newVal)
                    value = newVal
                    // 值发生变化时通知 dep 中的 watcher 更新视图
                    dep.notify()
                }
            }
        })
    }
}