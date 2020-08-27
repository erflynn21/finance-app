import { writable } from 'svelte/store';
import { useTracker } from 'meteor/rdb:svelte-meteor-data';



const ExpenseStore = writable([
    useTracker(() => Expenses.find({}, { sort: { date: -1 } }).fetch()),
]);

export default ExpenseStore;