import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebaseConfig from './config.json'

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage(app)

auth.languageCode = 'en'

export {
    auth,
    firestore,
    storage
}
