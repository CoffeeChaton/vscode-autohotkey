function addReduce(previousValue: number, currentValue: number): number {
    return previousValue + currentValue;
}

export function arrSum(arr: number[]): number {
    return arr.reduce(addReduce, 0);
}

export function stdDevFn(arr: number[]): number {
    const sum: number = arr.reduce(addReduce, 0);
    const avg: number = sum / arr.length;
    return Math.sqrt(
        // eslint-disable-next-line no-magic-numbers
        arr.map((n) => (n - avg) ** 2)
            .reduce(addReduce) / arr.length,
    );
}
