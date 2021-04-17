import {writable} from 'svelte/store';
import { selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let allExpenses = writable([]);
let expenses = writable([]);
let expensesSum = writable(0);
let expensesDatabaseName = writable(null);
expensesDatabaseName.set(`${get(selectedYear)}-expenses`);

export {expenses, expensesSum, expensesDatabaseName, allExpenses};