
import OverviewPage from '../pages/overviewTab.svelte';
import BudgetPage from '../pages/budgetTab.svelte';
import TransactionsPage from '../pages/transactionsTab.svelte';
import SettingsPage from '../pages/settingsTab.svelte';

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
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
