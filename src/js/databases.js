import { openCurrenciesDatabase } from './currencies.js';
import { openBaseBudgetsDatabase } from './baseBudgets.js';
import { openTransactionsDatabase } from './transactions.js';
import { openMonthlyBudgetsDatabase } from './monthlyBudgets.js';
import { openRecurringTransactionsDatabase } from './recurringTransactions.js';

const openDatabases = () => {
    // open transactions
    openTransactionsDatabase()
    // open currencies database
    openCurrenciesDatabase()
    // open monthlBudgets
    openMonthlyBudgetsDatabase().then(() => {
        openBaseBudgetsDatabase();
    })
    // open recurring transactions
    openRecurringTransactionsDatabase()
}

export { openDatabases };