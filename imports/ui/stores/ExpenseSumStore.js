import { writable } from 'svelte/store';

const expenseSumStore = writable('');

export {expenseSumStore};