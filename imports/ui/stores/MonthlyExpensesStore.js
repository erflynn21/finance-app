import {writable} from 'svelte/store';

let monthlyExpensesStore = writable('');

export {monthlyExpensesStore};