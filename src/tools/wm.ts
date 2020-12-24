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
            console.log(`${this.comment} with ${this.ms} ms`);
        }, ms);
    }

    public setWm(t: T, v: V): V {
        if (this.wmSize > this.wmMaxSize) {
            this.wm = new WeakMap<T, V>();
            this.wmSize = 0;
            console.log(`${this.comment} -> wmSize ${this.wmSize} > ${this.wmMaxSize} wmMaxSize`);
        }
        this.wm.set(t, v);

        if (Array.isArray(v)) {
            this.wmSize += v.length;
        } else if (v instanceof Map) {
            this.wmSize += v.size;
        } else if (typeof v === 'object') {
            this.wmSize += Object.keys(v).length;
        } else {
            this.wmSize++;
        }

        return v;
    }

    public getWm(t: T): V | null {
        return this.wm.get(t) || null;
    }
}
