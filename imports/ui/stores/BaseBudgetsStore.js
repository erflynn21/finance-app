import {writable} from 'svelte/store';

let baseBudgetsStore = writable('');

export {baseBudgetsStore};