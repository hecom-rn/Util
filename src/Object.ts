import _ from 'lodash'
import { mergeDeep } from 'immutable';

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
        return _.cloneDeep(obj);
    }
}

/**
 * 列表转为字典。转换过程中会强制深拷贝
 * @param arr 由对象组成的列表
 * @param keyName 使用列表项的键作为字典索引键
 */
export function listToDict<T extends Node<any>>(
    arr: T[],
    keyName: string,
    deepCopy = true
): Node<T> {
    const result: Node<T> = {};
    arr.forEach(value => {
        result[value[keyName] as string] = deepCopy ? deepJsonCopy(value) : value;
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

/**
 * 以code/id作为唯一标识，去掉数组类型值里面重复的item
*/
function removeDuplicate(obj: any) {
    if (obj) {
        if (Array.isArray(obj) && obj.length > 0) {
            let keyName: string = '';
            if (obj[0].code) {
                keyName = 'code';
            } else if (obj[0].id) {
                keyName = 'id';
            } else {
                return;
            }
            const dic = {};
            const arr: string[] = [];
            obj.forEach((item) => {
                if (item[keyName]) {
                    // @ts-ignore
                    const cur = dic[item[keyName]];
                    if (cur) {
                        const newItem = mergeDeep(cur, item);
                        removeDuplicate(newItem);
                        // @ts-ignore
                        dic[item[keyName]] = newItem;
                    } else {
                        arr.push(item[keyName]);
                        // @ts-ignore
                        dic[item[keyName]] = item;
                    }
                }
            });
            obj.length = 0;
            arr.forEach((key) => {
                // @ts-ignore
                obj.push(dic[key]);
            });
        } else if (typeof obj === 'object') {
            Object.keys(obj)?.forEach((key) => {
                removeDuplicate(obj[key]);
            });
        }
    }
}

export function deepMerge<C>(
    collection: C,
    ...collections: Array<Iterable<any> | Iterable<[any, any]> | {[key: string]: any}>
): C {
    const obj = mergeDeep(collection, ...collections);
    /**
     * mergeDeep对于数组，合并有问题，如下：
     * const dict = mergeDeep({a: [{ code: 1, name: 1 }, { code: 2, name: 2 }]}, {a: [{ code: 1, age: 1 }, { code: 2, age: 2 }]});
     * console.log(dict); // { a: [{ code: 1, name: 1 }, { code: 2, name: 2 }, { code: 1, age: 1 }, { code: 2, age: 2 }] }
     * 实际在软件应用场景中想得到的结果是以id/code作为唯一标识:
     * { a: [{ code: 1, name: 1, age: 1 }, { code: 2, name: 2, age: 2 }] }
     * 所以这里做一下去重，与合并。
      */
    removeDuplicate(obj);
    return obj;
}
