import {writable} from 'svelte/store';

let monthlyExpenses = writable([]);

export {monthlyExpenses};