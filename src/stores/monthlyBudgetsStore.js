import { writable } from "svelte/store";
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let monthlyBudgets = writable([]);
let monthlyBudgetsSum = writable(0);
let monthlyBudgetsDatabaseName = writable(null);
monthlyBudgetsDatabaseName.set(`${get(selectedYear)}-${get(selectedMonth)}-monthlyBudgets`);


export { monthlyBudgets, monthlyBudgetsSum, monthlyBudgetsDatabaseName };