class MyVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        if (this.$el) {
            // 数据劫持
            new Observer(this.$data)
            // 未编译前每个变量的dep subs为空
            // 数据和模板编译
            new Compile(this.$el, this)
        }
    }
}