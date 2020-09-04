import { writable } from 'svelte/store';

const userCurrencySymbol = writable('');

export {userCurrencySymbol};