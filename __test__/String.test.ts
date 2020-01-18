import * as Str from '../src/String';

test('replaceAll', ()=>{
    const raw = 'I am batman. I am not superman';
    const result = Str.replaceAll(raw, 'I am', 'You are');
    expect(result).toBe('You are batman. You are not superman')
});