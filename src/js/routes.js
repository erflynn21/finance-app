
import OverviewPage from '../pages/overviewTab.svelte';
import BudgetPage from '../pages/budgetTab.svelte';
import TransactionsPage from '../pages/transactionsTab.svelte';
import SettingsPage from '../pages/settingsTab.svelte';
import CurrencyOptionsPage from '../pages/currencyOptions.svelte';
import BudgetsPage from '../pages/budgets.svelte';
import MonthlyExpensesPage from '../pages/monthlyExpenses.svelte';
import MonthlyIncomesPage from '../pages/monthlyIncomes.svelte';
import SetCurrenciesPage from '../pages/setCurrencies.svelte';
import AuthPage from '../pages/auth.svelte';
import LoadingScreenPage from '../pages/loadingScreen.svelte';
import IntroSliderPage from '../pages/introSlider.svelte';
import NotFoundPage from '../pages/404.svelte';

let routes = [
  {
    path: '/loading-screen/',
    component: LoadingScreenPage,
  },
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
    path: '/budgets/',
    component: BudgetsPage,
  },
  {
    path: '/currency-options/',
    component: CurrencyOptionsPage,
  },
  {
    path: '/monthly-expenses/',
    component: MonthlyExpensesPage,
  },
  {
    path: '/monthly-incomes/',
    component: MonthlyIncomesPage,
  },
  {
    path: '/set-currencies/',
    component: SetCurrenciesPage,
  },
  {
    path: '/auth/',
    component: AuthPage,
  },
  {
    path: '/intro-slider',
    component: IntroSliderPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
  
];

export default routes;
