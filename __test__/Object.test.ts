import * as Obj from '../src/Object';

test('isEmpty', () => {
    const toBeTruthy = (value: any) => expect(Obj.isEmpty(value)).toBeTruthy();

    toBeTruthy(undefined);
    toBeTruthy(null);
    toBeTruthy('');
    toBeTruthy({});
    toBeTruthy([]);

    const toBeFalsy = (value: any) => expect(Obj.isEmpty(value)).toBeFalsy();

    toBeFalsy(0);
    toBeFalsy(1);
    toBeFalsy('12');
    toBeFalsy({a: 1});
    toBeFalsy([1]);
});

test('deepJsonCopy', () => {
    expect(Obj.deepJsonCopy(123)).toEqual(123);
    const obj = {};
    expect(obj).toBe(obj);
    expect(Obj.deepJsonCopy(obj)).not.toBe(obj);
});

test('listToDict', () => {
    const list = new Array(5).fill(0).map((_, index) => ({testStr: '测试' + index, testNum: index}));
    const dict = Obj.listToDict(list, 'testStr');
    expect(Object.keys(dict)).toHaveLength(5);
    expect(dict['测试2']).toEqual({testNum: 2, testStr: '测试2'});
});

test('traverseTree', () => {
    const tree = {c: [{c: [{c: [{}]}, {}]}, {c: [{}]}, {}]};
    const list = [tree, Obj.deepJsonCopy(tree)];
    const consumer = jest.fn();
    Obj.traverseTree(tree, consumer, 'c');
    expect(consumer).toHaveBeenCalledTimes(8);
    const consumer1 = jest.fn();
    Obj.traverseTree(list, consumer1, 'c');
    expect(consumer1).toHaveBeenCalledTimes(16);
});