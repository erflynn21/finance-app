import { openCurrenciesDatabase } from './currencies.js';
import { openBaseBudgetsDatabase } from './baseBudgets.js';
import { openTransactionsDatabase } from './transactions.js';
import { openMonthlyBudgetsDatabase } from './monthlyBudgets.js';
import { openRecurringTransactionsDatabase } from './recurringTransactions.js';

const openDatabases = () => {
    // open currencies database
    openCurrenciesDatabase();
    // open base budgets
    openBaseBudgetsDatabase();
    // open transactions
    openTransactionsDatabase();
    // open monthlBudgets
    openMonthlyBudgetsDatabase();
    // open recurring transactions
    openRecurringTransactionsDatabase();
}

export { openDatabases };