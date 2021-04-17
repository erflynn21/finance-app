import {writable} from 'svelte/store';

let monthlyIncomes = writable([]);

export {monthlyIncomes};