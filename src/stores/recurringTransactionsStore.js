import { writable } from "svelte/store";

let recurringTransactions = writable([]);

export { recurringTransactions };