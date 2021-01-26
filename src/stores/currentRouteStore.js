import {writable} from 'svelte/store';

let currentRoute = writable('not recurring');

export { currentRoute };