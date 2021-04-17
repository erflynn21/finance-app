import { openBudgetsDatabase } from "./budgets";
import { openCurrenciesDatabase } from "./currencies";
import { openExpensesDatabase } from "./expenses";
import { openIncomesDatabase } from "./incomes";
import { openMonthlyBudgetsDatabase } from "./monthlyBudgets";
import { openMonthlyExpensesDatabase } from "./monthlyExpenses";
import { openMonthlyIncomesDatabase } from "./monthlyIncomes";
import {allDatabases} from '../stores/userStore';
import userbase from 'userbase-js';

const openDatabases = () => {
    try {
        openCurrenciesDatabase();
        openMonthlyBudgetsDatabase().then(() => {
            openBudgetsDatabase()
        });
        openExpensesDatabase().then(() => {
            openMonthlyExpensesDatabase()
        });
        openIncomesDatabase().then(() => {
            openMonthlyIncomesDatabase()
        });
        getAllDatabases();
    } catch (e) {
        return e
    }
}

const getAllDatabases = () => {
    userbase.getDatabases().then((databases) => {
        allDatabases.set(databases);
    }).catch((e) => console.error(e))
}

export {openDatabases, getAllDatabases}