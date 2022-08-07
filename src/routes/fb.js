import { initializeApp } from 'firebase/app'

const p = import.meta.env
// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: p.VITE_API_KEY,
    authDomain: p.VITE_AUTH_DOMAIN,
    projectId: p.VITE_PROJECT_ID,
    storageBucket: p.VITE_STORAGE_BUCKET,
    messagingSenderId: p.VITE_MESSAGING_SENDER_ID,
    appId: p.VITE_APP_ID
}

//initializing firebase
const app = initializeApp(firebaseConfig)

export default app