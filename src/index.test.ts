const sum = (a: number, b: number): number => a + b;

test('Check the result of 5 + 2', () => {
    expect(sum(5, 2)).toBe(7);
});

test('Check toMatch test', () => {
    expect('Happy new year.').toMatch(/new/ui);
});

test('Check jest is run', () => {
    expect(0).toBe(0);
});
