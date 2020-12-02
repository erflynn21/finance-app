import { writable } from 'svelte/store';
import userbase from 'userbase-js';
import {
    openCurrenciesDatabase,
} from '../stores/currenciesStore';
import {
    openExpensesDatabase,
} from '../stores/expensesStore';
import { openBudgetsDatabase } from '../stores/budgetsStore';
import { openIncomesDatabase } from '../stores/incomesStore';
import { openMonthlyIncomesDatabase } from '../stores/monthlyIncomesStore';
import {
    openMonthlyBudgetsDatabase,
} from '../stores/monthlyBudgetsStore';
import { openMonthlyExpensesDatabase } from '../stores/monthlyExpensesStore';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

const userStore = writable(null);
const initialized = writable(false);

userbase
    .init({ appId: '5b975c6f-3f35-48f4-b92f-904372fbcb3b' })
    .then(({ user }) => {
        if (user) {
            openDatabases();   
        }
        userStore.set(user);
        initialized.set(true);
        SplashScreen.hide();
        // userbase.getDatabases().then((databases) => {
        //     console.log(databases)
        //   }).catch((e) => console.error(e))
    })
    .catch((e) => console.log(e));

const signUp = async (username, email, password) => {
    try {
        await userbase.signUp({ username, email, password, rememberMe: 'local' });
        location.reload();
        return openDatabases();
    } catch (e) {
        return console.log(e);
    } 
}

const signIn = async (username, password) => {
    try {
       await userbase.signIn({ username, password, rememberMe: 'local'});
        location.reload();
        return openDatabases();
    } catch (e) {
        return console.log(e);
    }
}

const signOut = async () => {
    try {
        await userbase.signOut();
        return userStore.set(null);
    } catch (e) {
        return console.log(e)
    }
}

const openDatabases = () => {
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
}

export { userStore, initialized, signUp, signIn, signOut };