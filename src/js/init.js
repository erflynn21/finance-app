import userbase from 'userbase-js';
import { initialized, userStore } from '../stores/userStore.js';
import { openDatabases } from './databases.js';

const initUserbase = () => {
    userbase
        .init({ 
            appId: import.meta.env.VITE_USERBASE_API_KEY,
            updateUserHandler: function ({ user }) {
                userStore.set(user);
            }
        })
        .then(({ user }) => {
            if (user) {
                userStore.set(user);
                openDatabases();
            } 
            initialized.set(true);
        })
        .catch((e) => {
            console.error('Userbase initialization error', e);
    });
} 

export { initUserbase };