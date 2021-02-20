class vNode {
    constructor(tag, nodeType, value, attributes) {
        this.tag = tag;
        this.nodeType = nodeType;
        this.value = value;
        this.attributes = attributes;
        this.children = [];
    }
    appendChild(child) {
        this.children.push(child)
    }
}