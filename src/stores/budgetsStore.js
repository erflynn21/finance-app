import { writable } from 'svelte/store';

let budgets = writable([]);
let budgetsSum = writable(0);
let categories = writable([]);

export {budgets, budgetsSum, categories };