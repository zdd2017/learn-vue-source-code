// 如何用VNode描述一个真实html标签
const elementVNode = {
    tag: 'div'
}

// 将VNode转变成真实的DOM节点，提供虚拟节点和需要挂载的父节点
function render(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    // 将VNode转变成真实的DOM节点
    let el = document.createElement(vnode.tag)
    // 挂载
    container.appendChild(el)
}

render(elementVNode, document.querySelector('app'))

// 组件的 VNode 应该如何表示 ?

// 组件
class myComponent {
    // 渲染得到组件的VNode
    render() {
        return {
            tag: 'div'
        }
    }
}

// 用VNode描述组件,将tag指向自身
const componentVNode = {
    tag: 'myComponent'
}

// 修改render函数
function render(vnode, container) {
    if (typeof vnode === 'string') {
        mountElement(vnode, container)
    } else {
        mountComponent(vnode, container)
    }
}

function mountComponent(vnode, container) {
    // 创建实例
    const instance = new vnode.tag()
    // 渲染得到组件的VNode
    instance.$vnode = instance.render()
    // 将VNode转变成真实的DOM节点并挂载
    mountElement(instance.$vnode, container)
}
