import userbase from "userbase-js";
import { recurringTransactions } from "../stores/recurringTransactionsStore";
const databaseName = 'recurringTransactions';

const openRecurringTransactionsDatabase = async () => {
    try {
        return userbase.openDatabase({
        databaseName: databaseName,
        changeHandler: (items) => {
            recurringTransactions.set(items);
        },
        });
    } catch (e) {
        return console.log(e);
    }
};

const addRecurringExpense = (recurringExpense) => {
    try {
        return userbase.insertItem({ databaseName, item: recurringExpense });
    } catch (e) {
        return e;
    }
};

const updateRecurringExpense = (recurringExpense, recurringExpenseId) => {
    try {
        return userbase.updateItem({ databaseName, item: recurringExpense, itemId: recurringExpenseId });
    } catch (e) {
        return e;
    }
};

const deleteRecurringExpense = (recurringExpenseId) => {
    try {
        return userbase.deleteItem({ databaseName, itemId: recurringExpenseId });
    } catch (e) {
        return e;
    }
}

export { openRecurringTransactionsDatabase, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense };