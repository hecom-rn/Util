/**
 * 判断值是否为空值，包括空字符串、空数组、空对象的判断。
 * @param value 待判断的值
 */
export function isEmpty(value: any): boolean {
    const isUndefined = typeof value === 'undefined' || value === null;
    const isString = typeof value === 'string' && value.length === 0;
    const isArray = Array.isArray(value) && value.length === 0;
    const isDict = Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0; // eslint-disable-line no-prototype-builtins
    return isUndefined || isString || isArray || isDict;
}

/**
 * 使用JSON转码方式进行深层拷贝对象。
 * @param obj 原对象
 */
export function deepJsonCopy<T>(obj: T): T {
    if (!obj) {
        return obj;
    } else {
        return JSON.parse(JSON.stringify(obj));
    }
}

/**
 * 列表转为字典。转换过程中会强制深拷贝
 * @param arr 由对象组成的列表
 * @param keyName 使用列表项的键作为字典索引键
 */
export function listToDict<T extends Node<any>>(
    arr: T[],
    keyName: string
): Node<T> {
    const result: Node<T> = {};
    arr.forEach(value => {
        result[value[keyName] as string] = deepJsonCopy(value);
    });
    return result;
}

interface Node<O> {
    [key: string]: O;
}

type TreeNode = Node<any>;

/**
 * 对对象进行树状结构遍历。
 * @param node 根节点
 * @param consumer 对每个节点的处理方法
 * @param childKey 子节点列表的键
 */
export function traverseTree(
    node: TreeNode,
    consumer?: (node: TreeNode) => void,
    childKey: string = 'children'
): void {
    if (isEmpty(node)) {
        return;
    }
    const stack: TreeNode[] = Array.isArray(node) ? [...node] : [node];
    while (stack.length > 0) {
        const tempNode = stack.pop() as TreeNode;
        consumer && consumer(tempNode);
        const children = tempNode[childKey];
        if (children && children.length > 0) {
            children.forEach((child: TreeNode) => stack.push(child));
        }
    }
}