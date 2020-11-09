
import OverviewPage from '../pages/overviewTab.svelte';
import BudgetPage from '../pages/budgetTab.svelte';
import TransactionsPage from '../pages/transactionsTab.svelte';
import SettingsPage from '../pages/settingsTab.svelte';
import CurrencyOptions from '../pages/currencyOptions.svelte';
import Budgets from '../pages/budgets.svelte';
import MonthlyExpenses from '../pages/monthlyExpenses.svelte';
import MonthlyIncomes from '../pages/monthlyIncomes.svelte';

import NotFoundPage from '../pages/404.svelte';

var routes = [
  {
    path: '/',
    component: OverviewPage,
  },
  {
    path: '/budget/',
    component: BudgetPage,
  },
  {
    path: '/transactions/',
    component: TransactionsPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '/currency-options/',
    component: CurrencyOptions,
  },
  {
    path: '/budgets/',
    component: Budgets,
  },
  {
    path: '/monthly-expenses',
    component: MonthlyExpenses,
  },
  {
    path: '/monthly-incomes',
    component: MonthlyIncomes,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
