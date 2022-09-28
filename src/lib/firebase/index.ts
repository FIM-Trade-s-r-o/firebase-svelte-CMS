import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import firebaseConfig from './config.json'

const app = initializeApp({
    credential: cert(firebaseConfig)
})

const firestore = getFirestore(app)
const storage = getStorage(app)

export {
    firestore,
    storage
}
