import { writable } from 'svelte/store';

const startDate = writable('');
const endDate = writable('');

// getting current date
const date = new Date();
const currentYear = date.getFullYear();
let currentMonth = '';
if (date.getMonth() + 1 >= 10) {
    currentMonth = date.getMonth() + 1;
} else {
    currentMonth = '0' + date.getMonth() + 1;
}

let today = '';
if (date.getDate() >= 10) {
    today = date.getDate();
} else {
    today = '0' + date.getDate();
}

const start = currentYear + '-' + currentMonth + '-01';
const end = currentYear + '-' + currentMonth + '-' + today;

startDate.set(`${start}`);
endDate.set(`${end}`);


export {startDate, endDate};