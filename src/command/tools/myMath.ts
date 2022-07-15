export function arrSum(arr: number[]): number {
    let ed = 0;
    for (const number of arr) {
        ed += number;
    }
    return ed;
}

export function stdDevFn(arr: number[]): number {
    const len: number = arr.length;
    const avg: number = arrSum(arr) / len;
    const s2: number = arrSum(arr.map((n) => (n - avg) ** 2)) / (len - 1);
    return s2 ** (1 / 2);
}

// 166, 170, 164, 165, 166, 165, 165, 165, 165, 165, 163, 162, 165, 165, 164, 164, 164, 164, 164, 166
// σ 1.52561463024
// s 1.56524758425
