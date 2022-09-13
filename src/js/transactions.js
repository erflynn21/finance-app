import { get } from 'svelte/store';
import userbase from 'userbase-js';
import { transactionsDatabaseName, transactions, expenses, expensesSum, income, incomeSum, savings, savingsSum, investments, investmentsSum  } from '../stores/transactionsStore';

const openTransactionsDatabase = async () => {
    try {
        return userbase.openDatabase({
            databaseName: get(transactionsDatabaseName),
            changeHandler: (items) => {
                transactions.set(items);
            },
        });
    } catch (e) {
        return console.log(e);
    }
}

const setExpenses = (items) => {
    // filters out only the expenses
    let allExpenses = [];
    items.forEach(item => {
        if (item.type === 'expense') {
            allExpenses = [...allExpenses, item];
        }
    });

    // sets the expenses store based on date and timestamp
    let a = allExpenses;
    a.sort(function (a, b) {
        return (
            new Date(b.item.date) - new Date(a.item.date) ||
            new Date(b.createdBy.timestamp) -
            new Date(a.createdBy.timestamp)
        );
    });
    expenses.set(a);

    // sets the expenses sum
    let totalExpenses = [];
    get(expenses).forEach((expense) => {
        totalExpenses = [...totalExpenses, expense.item.amount];
    });
    expensesSum.set(totalExpenses.reduce(function (a_2, b_1) {
        const sum = a_2 + b_1;
        const trimmed = Number(sum.toFixed(2));
        return trimmed;
    }, 0));
}

const setIncome = (items) => {
    // filters out only the income
    let allIncome = [];
    items.forEach(item => {
        if (item.type === 'income') {
            allIncome = [...allIncome, item];
        }
    });

    // sets the income store based on date and timestamp
    let a = allIncome;
    a.sort(function (a, b) {
        return (
            new Date(b.item.date) - new Date(a.item.date) ||
            new Date(b.createdBy.timestamp) -
            new Date(a.createdBy.timestamp)
        );
    });
    income.set(a);

    // sets the income sum
    let totalIncome = [];
    get(income).forEach((income) => {
        totalIncome = [...totalIncome, income.item.amount];
    });
    incomeSum.set(totalIncome.reduce(function (a_2, b_1) {
        const sum = a_2 + b_1;
        const trimmed = Number(sum.toFixed(2));
        return trimmed;
    }, 0));
}

const setSavings = (items) => {
    // filters out only the savings
    let allSavings = [];
    items.forEach(item => {
        if (item.type === 'savings') {
            allSavings = [...allSavings, item];
        }
    });

    // sets the savings store based on date and timestamp
    let a = allSavings;
    a.sort(function (a, b) {
        return (
            new Date(b.item.date) - new Date(a.item.date) ||
            new Date(b.createdBy.timestamp) -
            new Date(a.createdBy.timestamp)
        );
    });
    savings.set(a);

    // sets the savings sum
    let totalSavings = [];
    get(savings).forEach((savings) => {
        totalSavings = [...totalSavings, savings.item.amount];
    });
    savingsSum.set(totalSavings.reduce(function (a_2, b_1) {
        const sum = a_2 + b_1;
        const trimmed = Number(sum.toFixed(2));
        return trimmed;
    }, 0));
}

const setInvestments = (items) => {
    // filters out only the investments
    let allInvestments = [];
    items.forEach(item => {
        if (item.type === 'investment') {
            allInvestments = [...allInvestments, item];
        }
    });

    // sets the investments store based on date and timestamp
    let a = allInvestments;
    a.sort(function (a, b) {
        return (
            new Date(b.item.date) - new Date(a.item.date) ||
            new Date(b.createdBy.timestamp) -
            new Date(a.createdBy.timestamp)
        );
    });
    investments.set(a);

    // sets the investments sum
    let totalInvestments = [];
    get(investments).forEach((investment) => {
        totalInvestments = [...totalInvestments, investment.item.amount];
    });
    investmentsSum.set(totalInvestments.reduce(function (a_2, b_1) {
        const sum = a_2 + b_1;
        const trimmed = Number(sum.toFixed(2));
        return trimmed;
    }, 0));
}

const addTransaction = (transaction) => {
    try {
        return userbase.insertItem({ databaseName: get(transactionsDatabaseName), item: transaction });
    } catch (e) {
        return e;
    }
    
};

const updateTransaction = (transaction, transactionId) => {
    try {
        return userbase.updateItem({ databaseName: get(transactionsDatabaseName), item: transaction, itemId: transactionId });
    } catch (e) {
        return e;
    }
     
};

const deleteTransaction = (transactionId) => {
    try {
        return userbase.deleteItem({ databaseName: get(transactionsDatabaseName), itemId: transactionId });
    } catch (e) {
        return e;
    }
}

export { openTransactionsDatabase, setExpenses, setIncome, setSavings, setInvestments, addTransaction, updateTransaction, deleteTransaction };