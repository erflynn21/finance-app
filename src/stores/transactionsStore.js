import { writable } from "svelte/store";
import { get } from "svelte/store";
import { selectedMonth, selectedYear } from "./datesStore";

let transactions = writable([]);
let expenses = writable([]);
let expensesSum = writable(0);
let income = writable([]);
let incomeSum = writable(0);
let savings = writable([]);
let savingsSum = writable(0);
let investments = writable([]);
let investmentsSum = writable(0);
let transactionsDatabaseName = writable(null);
transactionsDatabaseName.set(`${get(selectedMonth)}-${get(selectedYear)}-transactions`);

export { transactions, transactionsDatabaseName, expenses, income, savings, investments, expensesSum, incomeSum, savingsSum, investmentsSum };