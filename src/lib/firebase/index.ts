import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from './config.json';
import { writable } from "svelte/store";
import { onAuthStateChanged } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

auth.languageCode = "en";

function UserStoreContract() {
    const { subscribe, set } = writable(auth.currentUser);

    onAuthStateChanged(auth, (userState) => {
        set(userState);
    });

    return {
        subscribe
    }
}

const user = UserStoreContract;

export {
    auth,
    firestore,
    user
};
