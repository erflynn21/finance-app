import { writable } from 'svelte/store';

const userStore = writable(null);
const initialized = writable(false);
const allDatabases = writable(null);
const userSetUp = writable(false);

export { userStore, initialized, allDatabases, userSetUp };