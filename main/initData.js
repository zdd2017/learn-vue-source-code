let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice',
];

myVue.prototype.initData = function () {
    // 修改数据的时候模板要刷新，传入this
    observe(this._data, this)
    // 响应式化 ??? 为什么要遍历
    //   for ( let i = 0; i < keys.length; i++ ) {
    //     // 这里将 对象 this._data[ keys[ i ] ] 变成响应式的
    //     observe( this._data, this );
    //   }
    // 代理
    for (let key in this._data) {
        proxy(this, '_data', key)
    }

}

// ???为什么老师的方法要复杂许多
function observe(obj, vm) {
    // 先判断类型
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            observe(obj[i], vm)
        }
        // 数组方法拦截
        redefineArrayMethods(obj, vm)
    } else {
        for (let key in obj) {
            let value = obj[key]
            defineReactive.call(vm, vm, obj, key, value, true)
        }
    }
}

// 代理方法（app._data.name --> app.name）
function proxy(app, prop, key) {
    Object.defineProperty(app, key, {
        configurable: true,
        enumerable: true,
        get() {
            return app[prop][key]
        },
        set(newVal) {
            app[prop][key] = newVal
        }
    })
}

// 处理 push pop 等数组方法响应问题
function redefineArrayMethods(arr, vm) {
    let array_methods = Object.create(Array.prototype)

    ARRAY_METHOD.forEach(key => {
        array_methods[key] = function () {
            // 将数据响应式化
            console.log('响应式化变量')
            for (var i = 0; i < arguments.length; i++) {
                observe(arguments[i], vm)
            }
            // 调用原始方法
            Array.prototype[key].apply(this, arguments)
            // Array.prototype[key](arguments) ???
        }
    })
    arr.__proto__ = array_methods
    return arr
}

// 响应式
function defineReactive(vm, obj, key, value, enumerable) {
    if (typeof value === 'object' && value != null) {
        // 是非数组的引用类型
        observe(value); // 递归
    }
    let that = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: !!enumerable,
        get() {
            return value
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
        },
        set(newValue) {
            // 处理直接赋值对象不能响应化的情况
            // if (typeof newValue === 'object') {
            observe(newValue, vm)
            // }
            value = newValue;
            // 数据改变刷新模板
            // that.mountComponent()
            // 用notify替换掉上面重新刷新模板的方法
            dep.notify()
        }
    })
}
