import { openCurrenciesDatabase } from "../stores/currenciesStore";
import { openExpensesDatabase } from "../stores/expensesStore";
import { openIncomesDatabase } from "../stores/incomesStore";
import { openMonthlyBudgetsDatabase } from "../stores/monthlyBudgetsStore";
import { openMonthlyExpensesDatabase } from "../stores/monthlyExpensesStore";
import { openMonthlyIncomesDatabase } from "../stores/monthlyIncomesStore";
import { openBudgetsDatabase } from "./budgets";

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
        // console.log(get(allDatabases));
    }).catch((e) => console.error(e))
}

export {openDatabases, getAllDatabases}