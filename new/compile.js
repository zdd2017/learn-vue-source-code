class Compile {
    constructor(el, vm) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.vm = vm;
        // 用碎片存储，提升性能
        let fragment = this.node2fragment()
        this.compile(fragment)
        this.el.appendChild(fragment)
    }
    node2fragment() {
        let fragment = document.createDocumentFragment();
        let childNodes = this.el.childNodes
        if (childNodes.length) {
            [...childNodes].forEach(node => {
                fragment.appendChild(node)
            })
        }
        return fragment;
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        if (childNodes.length) {
            [...childNodes].forEach(node => {
                // 判断节点类型
                // 元素节点
                if (node.nodeType === 1) {
                    this.compileElement(node);
                    this.compile(node)
                } else if (node.nodeType === 3) {
                    if (node.textContent.trim()) {
                        this.compileText(node);
                    }
                }
            })
        }
    }
    compileElement(node) {
        // node: <div v-text='message'></div>
        let attrs = node.attributes;
        [...attrs].forEach(attr => {
            if (attr.name.startsWith('v-')) {
                // v-text/v-model
                let expr = attr.value
                let [, type] = attr.name.split('-')
                CompileUtil[type](node, expr, this.vm)
            }
        })
    }
    compileText(node) {
        let expr = node.textContent
        // 判断是不是有{{}}
        let reg = /\{\{(.+?)\}\}/g
        if (reg.test(expr)) {
            CompileUtil['text'](node, expr, this.vm)
        }

    }
}

CompileUtil = {
    text(node, expr, vm) {
        let value = this.getVal(vm, expr)
        expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            let key = args[1].trim()
            new Watcher(vm.$data, key, (val) => {
                node.textContent = val
            })
        })
        // 更新视图
        node.textContent = value

    },
    getVal(vm, expr) {
        // 将expr用vm中的数据替换
        let txt = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return getValueByPath(vm.$data, args[1].trim())
        })
        return txt
    },

    model(node, expr, vm) {
        // console.log(node)
        new Watcher(vm.$data, expr, (val) => {
            node.value = val
        })
        node.value = getValueByPath(vm.$data, expr)
    }
}

