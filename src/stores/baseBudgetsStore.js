import { writable } from 'svelte/store';

let baseBudgets = writable([]);
let baseBudgetsSum = writable(0);
let categories = writable([]);

export { baseBudgets, baseBudgetsSum, categories };