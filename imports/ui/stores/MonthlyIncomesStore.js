import {writable} from 'svelte/store';

let monthlyIncomesStore = writable('');

export {monthlyIncomesStore};