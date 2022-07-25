import {
    base16toNumber,
    to0X,
    winMsg,
    winMsgRe,
} from './Windows_Messages';

test('Check Windows_Messages name ruler', () => {
    for (const [wm, [base10, base16]] of winMsg.entries()) {
        if (!wm.startsWith('WM_')) {
            expect(false).toBeTruthy();
        }
        if (wm.toUpperCase() !== wm) {
            expect(false).toBeTruthy();
        }
        if (base16toNumber(base16) !== base10) {
            expect(false).toBeTruthy();
        }
    }

    // https://www.autohotkey.com/docs/misc/SendMessageList.htm at 2022/7/23

    // eslint-disable-next-line no-magic-numbers
    if (winMsg.size !== 207) {
        expect(false).toBeTruthy();
    }

    // eslint-disable-next-line no-magic-numbers
    if (winMsgRe.size !== 201) {
        expect(false).toBeTruthy();
    }
});

test('test 1000 to "0x03E8"', () => {
    const number1000 = 1000;
    expect(to0X(number1000) === '0x03E8').toBeTruthy();
});

test('test "0x03E8" to 1000', () => {
    const number1000 = 1000;
    expect(base16toNumber('0x03E8') === number1000).toBeTruthy();
});
