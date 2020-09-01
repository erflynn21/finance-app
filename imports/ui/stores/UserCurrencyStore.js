import { writable } from 'svelte/store';

const userCurrency = writable('');

export {userCurrency};