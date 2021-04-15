import { initialized, userSetUp, userStore } from "../stores/userStore";
import { openDatabases } from "./databases";
import userbase from 'userbase-js';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

userbase
    .init({ appId: process.env.USERBASE_API_KEY })
    .then(({ user }) => {
        if (user) {
            openDatabases(); 
            userStore.set(user);
        }
        
        if (user.profile === undefined) {
            return;
        } else if (user.profile.setUpDone === 'true') {
            userSetUp.set(true);
        }
    })
    .catch((e) => console.log(e))
    .finally(() => {
        initialized.set(true);
        SplashScreen.hide();
});

const signUp = async (username, email, password) => {
    try {
        await userbase.signUp({ username, email, password, rememberMe: 'local' });
        location.reload();
        return openDatabases();
    } catch (e) {
        return e;
    } 
}

const signIn = async (username, password) => {
    try {
       await userbase.signIn({ username, password, rememberMe: 'local'});
        location.reload();
        return openDatabases();
    } catch (e) {
        return e;
    }
}

const signOut = async () => {
    try {
        await userbase.signOut();
        return userStore.set(null);
    } catch (e) {
        return e;
    }
}

const updateUser = async (user) => {
    try {
        if (user.currentPassword && user.newPassword1 && user.newPassword2) {
            await userbase.updateUser({
                username: user.username,
                email: user.email,
                currentPassword: user.currentPassword,
                newPassword: user.newPassword1,
            });
        } else {
            await userbase.updateUser({
                username: user.username,
                email: user.email
            });  
        }
    } catch (e) {
        return e;
    }
}

const deleteUser = async () => {
    try {
        await userbase.deleteUser();
        return userStore.set(null);
    } catch (e) {
        return e;
    }
}

const setUpDone = async () => {
    try {
        await userbase.updateUser({
            profile: {
                setUpDone: 'true',
            }
        }).then(() => {
            location.reload();
        });
    } catch (e) {
        return e;
    }
}

export {signUp, signIn, signOut, updateUser, deleteUser, setUpDone}