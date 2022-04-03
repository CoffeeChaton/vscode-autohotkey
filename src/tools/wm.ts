function calcSize<V>(v: V | undefined): number {
    if (v === null || v === undefined) return 0;
    if (Array.isArray(v)) return v.length;
    if (v instanceof Map) return v.size;
    // if (v.value && v.value.length) return v.value.length;
    if (typeof v === 'object') return Object.keys(v).length;

    return 1;
}

type TObj = Record<string, unknown>;

// T === Object has name
export class ClassWm<T extends TObj | unknown[] | readonly unknown[], V> {
    public cacheHits = 0;

    public wmSize = 0;

    public readonly Interval: NodeJS.Timeout;

    public readonly wmMaxSize: number;

    public readonly fnName: string;

    public readonly ms: number;

    private wm: WeakMap<T, V> = new WeakMap<T, V>();

    /**
     * @param ms
     * @param comment
     * @param wmMaxSize 0 means no limit
     */
    public constructor(ms: number, comment: string, wmMaxSize: number) {
        this.wmMaxSize = wmMaxSize;
        this.fnName = comment;
        this.ms = ms;
        this.Interval = setInterval(() => {
            this.wm = new WeakMap<T, V>();
            this.wmSize = 0;
            console.log(`wm Clear ${this.fnName} with ${this.ms} ms`);
        }, ms);
    }

    public setWm(t: T, v: V): V {
        this.wmSize -= calcSize<V>(this.wm.get(t));
        if (this.wmMaxSize && this.wmSize > this.wmMaxSize) {
            this.wm = new WeakMap<T, V>();
            this.wmSize = 0;
            console.log(`🚀 wm Clear ${this.fnName} with wmSize ${this.wmSize} > ${this.wmMaxSize} wmMaxSize`);
        }
        this.wm.set(t, v);
        this.wmSize += calcSize<V>(v);
        return v;
    }

    public getWm(t: T): V | undefined {
        const cache: V | undefined = this.wm.get(t);
        if (cache !== undefined) {
            this.cacheHits++;
        }
        return cache;
    }
}
