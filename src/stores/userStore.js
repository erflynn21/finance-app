import { writable } from 'svelte/store';
import userbase from 'userbase-js';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

const userStore = writable(null);
const initialized = writable(false);

userbase
    .init({ appId: '5b975c6f-3f35-48f4-b92f-904372fbcb3b' })
    .then(({ user }) => {
        userStore.set(user);
        // userbase.getDatabases().then((databases) => {
        //     console.log(databases)
        //   }).catch((e) => console.error(e))
    })
    .catch((e) => console.log(e))
    .finally(() => {
        SplashScreen.hide();
        initialized.set(true);
    });

export { userStore, initialized };