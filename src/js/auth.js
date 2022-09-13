import { userStore } from "../stores/userStore";
// import { openDatabases } from "./databases";
import userbase from 'userbase-js';
import { f7 } from "framework7-svelte";

const signUp = async (username, email, password) => {
    try {
        await userbase.signUp({ username, email, password, rememberMe: 'local' }).then((user) => {
            userStore.set(user);        
       });
    } catch (e) {
        return e;
    } 
}

const signIn = async (username, password) => {
    try {
       await userbase.signIn({ username, password, rememberMe: 'local'}).then((user) => {
            userStore.set(user);        
       });
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

// const updateUser = async (user) => {
//     try {
//         if (user.currentPassword && user.newPassword1 && user.newPassword2) {
//             await userbase.updateUser({
//                 username: user.username,
//                 email: user.email,
//                 currentPassword: user.currentPassword,
//                 newPassword: user.newPassword1,
//             });
//         } else {
//             await userbase.updateUser({
//                 username: user.username,
//                 email: user.email
//             });  
//         }
//     } catch (e) {
//         return e;
//     }
// }

// const deleteUser = async () => {
//     try {
//         await userbase.deleteUser();
//         return userStore.set(null);
//     } catch (e) {
//         return e;
//     }
// }

const finishOnboarding = async (currencies) => {
    f7.dialog.preloader('Saving your settings for you...')
    try {
        await userbase.updateUser({
            profile: {
                onboardingDone: 'true',
            }
        });
    } catch (e) {
        console.log(e);
    }
    f7.dialog.close();
}

export {signUp, signIn, signOut, finishOnboarding};
// export {signUp, signIn, signOut, updateUser, deleteUser, setUpDone}