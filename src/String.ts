/**
 * 对字符串中的所有find替换为replace。
 * @param str 目标字符串
 * @param find 待替换内容
 * @param replace 替换目标内容
 */
export function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * 生成随机的GUID。
 */
export function guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}