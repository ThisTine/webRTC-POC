import { initializeApp,getApps , type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {firebaseConfig} from "$lib/firebase/firebase.config";

/**
 * Your firebase client SDK config goes here
 */

let firebaseApp:FirebaseApp | undefined;
// create singleton of firebase client app
if(!getApps().length){
    firebaseApp = initializeApp(firebaseConfig);
}
else{
    firebaseApp = getApps()[0]
}

let firestore = getFirestore(firebaseApp);

// export the firebase app
export {firebaseApp,firestore}