export type TPick<TNeed> = {
    label: string,
    fn: () => Promise<TNeed>,
} | {
    label: string,
    fn: () => TNeed,
};
