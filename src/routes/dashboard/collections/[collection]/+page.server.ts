import { firestore } from '$lib/firebase'
import {collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc} from 'firebase/firestore'
import config from '$lib/config'

const getCollectionData = async (collectionName) => {
    const sorting = config.getCollection(collectionName).sortBy
    let docsSnap
    if (sorting) {
        docsSnap = await getDocs(query(collection(firestore, collectionName), orderBy(sorting.property, sorting.sort)))
    } else {
        docsSnap = await getDocs(collection(firestore, collectionName))
    }

    let collectionData = []
    await docsSnap.forEach(document => {
        // console.log(document)
        collectionData = [
            ...collectionData,
            {
                id: document.id,
                ...document.data()
            }
        ]
    })
    return collectionData
}

const createDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const schema = config.getCollection(collectionName).schema
    const retrievedFormData = {}
    schema.forEach(({ property, type }) => {
        retrievedFormData[property] = type.type(data.get(property))
    })
    const collectionRef = collection(firestore, collectionName)
    const docRef = await addDoc(collectionRef, retrievedFormData)
    return {
        id: docRef.id
    }
}

const updateDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const documentId = data.get('documentId')
    const schema = config.getCollection(collectionName).schema
    const retrievedFormData = {}
    schema.forEach(({ property, type }) => {
        retrievedFormData[property] = type.type(data.get(property))
    })
    await updateDoc(doc(firestore, collectionName, documentId), retrievedFormData)
}

const deleteDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const documentId = data.get('documentId')
    await deleteDoc(doc(firestore, collectionName, documentId))
}

export async function load ({ params }) {
    const collectionName = params.collection
    const collectionData = await getCollectionData(collectionName)
    const schema = config.getCollection(collectionName).schema.toJSON()
    return {
        collectionName,
        collectionData,
        schema
    }
}

export const actions = {
    createDocument,
    updateDocument,
    deleteDocument
}
