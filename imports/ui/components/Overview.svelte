<script>
    import { onMount } from 'svelte';
    import ExpenseList from './ExpenseList.svelte';
    import IncomeList from './IncomeList.svelte';
    import BudgetList from './BudgetList.svelte';
    import Settings from './Settings.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { Expenses } from '../../api/expenses';
    import Forms from './Forms.svelte';
    import Nav from './Nav.svelte';

    const setUserCurrency = () => {
        usersetting = UserSettings.findOne({});
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency.set(usersetting.baseCurrency);
        }
    };

    // getting summary of total amounts for expenses, income and budgets
    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({}).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expenseSum);
    };

    $: incomeSum = 0;
    const recalculateIncomes = (totalIncomes) => {
        incomes = totalIncomes.detail.data;
        incomeSum = incomes.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    $: remainingTotal = Number((incomeSum - expenseSum).toFixed(2));

    $: budgetSum = 0;
    const recalculateBudgets = (totalBudgets) => {
        budgets = totalBudgets.detail.data;
        budgetSum = budgets.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    $: remainingBudget = incomeSum - budgetSum;

    onMount(() => {
        Meteor.subscribe('usersettings', function () {
            setUserCurrency();
            calculateExpenses();
        });
    });
</script>

<div class="container">

    <div>
        <MonthlyBudget on:calculate={calculateExpenses} />
    </div>
    <div>
        <!--  -->
        <!-- List of expenses -->
        <ExpenseList
            on:delete={calculateExpenses}
            on:expenseEdited={calculateExpenses}
            on:calculate={calculateExpenses} />
        <h3>Total Expenses: {$expenseSumStore}</h3>
        <!-- List of incomes -->
        <IncomeList on:recalculateIncome={recalculateIncomes} />
        <h3>Total Income: {incomeSum}</h3>
        <h3>Remaining Total: {remainingTotal}</h3>
        <!-- List of budgets -->
        <BudgetList on:recalculateBudgets={recalculateBudgets} />
        <h3>
            Total Budgeted: {budgetSum} out of {incomeSum}. You have {remainingBudget}
            left to budget.
        </h3>
    </div>
    <Settings />
    <Forms />
    <Nav />
</div>

<style>

</style>
