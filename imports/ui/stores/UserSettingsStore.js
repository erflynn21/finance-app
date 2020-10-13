import {writable} from 'svelte/store';

let userSettingsStore = writable('');

export {userSettingsStore};