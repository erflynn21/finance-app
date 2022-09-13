import LoadingScreenPage from '../pages/loadingScreen.svelte';
import OverviewPage from '../pages/overview.svelte';
import BudgetPage from '../pages/budget.svelte';
import TransactionsPage from '../pages/transactions.svelte';
import SettingsPage from '../pages/settings.svelte';
import AuthPage from '../pages/auth.svelte';
import OnboardingPage from '../pages/onboarding.svelte';

import NotFoundPage from '../pages/404.svelte';

var routes = [
  {
    path: '/auth/',
    component: AuthPage,
  },
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
    path: '/onboarding/',
    component: OnboardingPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
