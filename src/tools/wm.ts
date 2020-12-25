function calcSize<V>(v: V): number {
    if (Array.isArray(v)) return v.length;
    if (v instanceof Map) return v.size;
    if (typeof v === 'object') return Object.keys(v).length;

    return 1;
}
export class ClassWm<T extends Record<string, unknown>, V> {
    public wm: WeakMap<T, V> = new WeakMap<T, V>();

    public wmSize = 0;

    public readonly Interval: NodeJS.Timeout;

    public readonly wmMaxSize: number;

    public readonly comment: string;

    public readonly ms: number;

    public constructor(ms: number, comment: string, wmMaxSize: number) {
        this.wmMaxSize = wmMaxSize;
        this.comment = comment;
        this.ms = ms;
        this.Interval = setInterval(() => {
            this.wm = new WeakMap<T, V>();
            this.wmSize = 0;
            console.log(`wm Clear ${this.comment} with ${this.ms} ms`);
        }, ms);
    }

    public setWm(t: T, v: V): V {
        if (this.wmSize > this.wmMaxSize) {
            this.wm = new WeakMap<T, V>();
            this.wmSize = 0;
            console.log(`wm Clear ${this.comment} with wmSize ${this.wmSize} > ${this.wmMaxSize} wmMaxSize`);
        }
        this.wm.set(t, v);
        this.wmSize += calcSize<V>(v);
        return v;
    }

    public getWm(t: T): V | null {
        return this.wm.get(t) || null;
        // const cache = this.wm.get(t) || null;
        // if (cache) {
        //     console.log('t', t);
        //     console.log('cache', cache);
        // }
        // return cache;
    }
}
