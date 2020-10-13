import {writable} from 'svelte/store';

let incomesStore = writable('');

export {incomesStore};