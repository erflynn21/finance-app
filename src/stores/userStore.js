import { writable } from 'svelte/store';

const initialized = writable(false);
const userStore = writable(null);

export { initialized, userStore };