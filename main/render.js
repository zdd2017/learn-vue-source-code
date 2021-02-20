myVue.prototype.mount = function () {
    // 生成虚拟DOM ???为什么不直接调用，而是要用this.render存起来
    this.render = this.createRenderFn()

    // 把生成的虚拟DOM挂载到页面上
    this.mountComponent()
}

myVue.prototype.createRenderFn = function () {
    // 把模板的真实DOM转换为虚拟DOM
    let ast = toVNode(this._temp)
    // 将ast中的变量用数据替换 ???这里是不是用闭包缓存_temp
    return function render() {
        // ???什么时候用函数，什么时候需要绑在原型上
        let _temp = combine(ast, this._data)
        return _temp
    }
}

myVue.prototype.mountComponent = function () {
    // 懵逼，为什么 要写成这样
    let mount = () => {
        this.update(this.render())
    }
    mount()
    //mount.call(this)

}

myVue.prototype.update = function (temp) {
    // 如何做到缓存的，需不需要克隆原模板？？？
    let newTemp = toDom(temp)
    // 这里需要重新获取temp,因为它已经被替换掉了不是原来那个了
    this._parent.replaceChild(newTemp, document.querySelector('#root'))
}