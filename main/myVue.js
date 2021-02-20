function myVue(options) {
    this._data = options.data;
    this._temp = document.querySelector(options.el);
    // ???为什么要缓存parent，否则就是null?
    this._parent = this._temp.parentNode
    this.initData(); // 将 data 进行响应式转换, 进行代理

    this.mount()
}