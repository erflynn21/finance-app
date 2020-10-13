import {writable} from 'svelte/store';

let expensesStore = writable('');

export {expensesStore};