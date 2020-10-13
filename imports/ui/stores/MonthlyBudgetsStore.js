import {writable} from 'svelte/store';

let monthlyBudgetsStore = writable('');

export {monthlyBudgetsStore};