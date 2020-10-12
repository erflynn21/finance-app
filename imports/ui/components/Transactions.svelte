<script>
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { incomeSumStore } from '../stores/IncomeSumStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { startDate, endDate } from '../stores/CurrentDateStore';
    import { Expenses } from '../../api/expenses';
    import { Incomes } from '../../api/incomes';
    import Heading from '../shared/Heading.svelte';

    // getting summary of total amounts for expenses, income and budgets
    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses
            .reduce(function (a, b) {
                return a + b;
            }, 0)
            .toFixed(2);
        expenseSumStore.set(expenseSum);
    };

    $: incomeSum = 0;
    const calculateIncomes = () => {
        let totalIncomes = Incomes.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();
        let incomes = [];
        totalIncomes.forEach((expense) => {
            incomes = [...incomes, expense.amount];
        });
        incomeSum = incomes
            .reduce(function (a, b) {
                return a + b;
            }, 0)
            .toFixed(2);
        incomeSumStore.set(incomeSum);
    };

    $: remainingTotal = Number(($incomeSumStore - $expenseSumStore).toFixed(2));
</script>

<div class="container">
    <Heading>Transactions</Heading>
    <div>
        <!-- List of expenses -->
        <h1>Expenses:</h1>
        <h3>Total Expenses: {$userCurrencySymbol}{$expenseSumStore}</h3>
        <ExpenseList
            on:delete={calculateExpenses}
            on:expenseEdited={calculateExpenses}
            on:calculateExpenses={calculateExpenses} />
        <!-- List of incomes -->
        <h1>Income:</h1>
        <h3>Total Income: {$userCurrencySymbol}{$incomeSumStore}</h3>
        <IncomeList
            on:delete={calculateIncomes}
            on:incomeEdited={calculateIncomes}
            on:calculateIncomes={calculateIncomes} />
        <h3>Remaining: {$userCurrencySymbol}{remainingTotal}</h3>
    </div>
</div>

<style>
    h1 {
        font-size: 16px;
        color: black;
        font-weight: 500;
        text-align: center;
        margin: 10px 0;
    }

    h3 {
        font-size: 14px;
        color: black;
        font-weight: 400;
        text-align: center;
        margin: 10px 0;
    }

    .container {
        margin-bottom: 60px;
    }
</style>
