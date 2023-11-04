import { BoxedExpression } from "@cortex-js/compute-engine";

export let numericals = new Map<string, number | null>();
export let raws = new Map<string, BoxedExpression>();
export function registerVariable(name: string, numerical: number | null, raw: BoxedExpression) {
    // do some validation
    if(name.replace(/[^a-zA-Z0-9_]/g, '') !== name) {
        throw new Error('Invalid variable name');
    }
    numericals.set(name, numerical);
    raws.set(name, raw);
}

(window as any).numericals = numericals;
(window as any).raws = raws;