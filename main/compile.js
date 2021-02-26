function toVNode(dom) {
    let nodeType = dom.nodeType;
    let v_node = null
    // 元素节点需要遍历看是否有子节点
    if (nodeType === 1) {
        let tag = dom.nodeName.toLowerCase();
        let attr = dom.attributes;
        // attributes结构看不懂 类数组？
        // console.log('attr:', attributes)
        let attributes = {}
        for (let i = 0; i < attr.length; i++) {
            attributes[attr[i].nodeName] = attr[i].nodeValue
        }
        v_node = new vNode(tag, nodeType, undefined, attributes)
        for (i = 0; i < dom.childNodes.length; i++) {
            let child = toVNode(dom.childNodes[i])
            v_node.appendChild(child)
        }
    } else if (nodeType === 3) {
        let value = dom.nodeValue;
        v_node = new vNode(undefined, nodeType, value, undefined)
    }
    return v_node
}

// 虚拟DOM转换为DOM
function toDom(vNode) {
    // 判断节点类型
    if (vNode.nodeType === 1) {
        // 创建元素节点
        let node = document.createElement(vNode.tag)
        // 创建属性节点
        for (let key in vNode.attributes) {
            let value = vNode.attributes[key]
            node.setAttribute(key, value)
        }
        for (let i = 0; i < vNode.children.length; i++) {
            node.appendChild(toDom(vNode.children[i]))
        }
        return node;
    } else if (vNode.nodeType === 3) {
        let text = document.createTextNode(vNode.value);
        return text
    }
}

// 对象深层查找
function getValueByPath(obj, path) {
    let pathArr = path.split('.');
    let prop;
    // 难点
    while (prop = pathArr.shift()) {
        obj = obj[prop]
    }
    return obj
}

// combine 和 compile 的区别 ？？？ 为什么combine里还要再new vNode，不是直接替换变量
// 模板——》ast——》虚拟DOM
function combine(generateNode, data) {
    let nodeType = generateNode.nodeType;
    if (nodeType === 1) {
        let tag = generateNode.tag
        let attributes = generateNode.attributes
        let children = generateNode.children
        let node = new vNode(tag, nodeType, undefined, attributes)
        // 处理子节点
        for (let i = 0; i < children.length; i++) {
            let childNode = combine(children[i], data)
            node.appendChild(childNode)
        }
        return node
    }
    else if (nodeType === 3) {
        let val = generateNode.value;
        // 正则匹配 ??为什么要取消贪婪
        let reg = /\{\{(.+)\}\}/g
        // 把匹配到的内容替换成data里的值
        let txt = val.replace(reg, function (oldVal, newVal) {
            console.log(oldVal, newVal)
            // 回调函数的第一个参数表示匹配到的内容，第n+1个参数表示第n个分组
            let key = newVal.trim()
            // 没有嵌套的对象属性
            return getValueByPath(data, key)
            // 不 return 直接在里面替换也行？
            // childs[i].nodeValue = data[key]
        })
        let node = new vNode(undefined, nodeType, txt, undefined)
        new Watcher(data, val, (newVal) => {
            // 更新
        })
        return node;
    }

}
