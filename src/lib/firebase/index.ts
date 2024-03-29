import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import firebaseConfig from './config.json'

const app = getApps()[0] || initializeApp({
    credential: cert(firebaseConfig.credential),
    ...firebaseConfig.rest
})

const firestore = getFirestore(app)
const storage = getStorage(app).bucket()

export {
    firestore,
    storage
}
