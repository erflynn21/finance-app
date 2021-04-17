import {writable} from 'svelte/store';
import { selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let allIncomes = writable([]);
let incomes = writable([]);
let incomesSum = writable(0);
let incomesDatabaseName = writable(null);
incomesDatabaseName.set(`${get(selectedYear)}-incomes`);

export {incomes, incomesSum, incomesDatabaseName, allIncomes};